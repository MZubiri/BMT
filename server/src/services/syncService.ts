import { query } from '../db/db';

interface GroupRank {
  badge_code: string;
  rank_name: string;
  role_name: 'OWNER' | 'OFFICER' | 'MEMBER';
}

interface HabboGroup {
  id: string;
  name: string;
  badgeCode: string;
  isAdmin: boolean;
}

export const syncService = {
  /**
   * Syncs a single user from Habbo.es, checks their groups,
   * maps them to the appropriate BMT rank/role, and updates MySQL.
   */
  async syncUser(username: string): Promise<any> {
    const trimmedName = username.trim();
    if (!trimmedName) throw new Error('El nombre de usuario no puede estar vacío');

    // 1. Fetch user uniqueId from Habbo API
    const userUrl = `https://www.habbo.es/api/public/users?name=${encodeURIComponent(trimmedName)}`;
    const userResponse = await fetch(userUrl);
    
    if (userResponse.status === 404) {
      throw new Error(`El keko "${trimmedName}" no existe en Habbo.es`);
    }
    
    if (!userResponse.ok) {
      throw new Error('No se pudo conectar con el servidor de Habbo.es');
    }

    const userData = await userResponse.json();
    const uniqueId = userData.uniqueId;
    const figure = userData.figureString;
    const name = userData.name; // Keep official case

    // 2. Fetch full profile to get groups list
    let habboGroups: HabboGroup[] = [];
    let isProfilePrivate = false;
    
    const profileUrl = `https://www.habbo.es/api/public/users/${uniqueId}/profile`;
    const profileResponse = await fetch(profileUrl);
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      habboGroups = profileData.groups || [];
    } else {
      console.warn(`Could not fetch profile for ${name} (likely private profile). Falling back to basic info.`);
      isProfilePrivate = true;
    }

    // 3. Load mapped ranks configurations from our DB
    const groupConfigs = await query<GroupRank[]>('SELECT * FROM group_ranks');
    
    // Default values if no matching group is found
    let matchedRank = 'Grumete';
    let matchedRole: 'OWNER' | 'OFFICER' | 'MEMBER' = 'MEMBER';

    // Track hierarchy priority
    // Estado Mayor > Generales > Oficiales Superiores > Oficiales > Sub-Oficiales > Reclutas
    const hierarchyOrder = ['owner', 'officer', 'member'];
    
    for (const group of habboGroups) {
      const config = groupConfigs.find(c => c.badge_code === group.badgeCode);
      if (config) {
        // If we found a config, check if it has higher priority or is admin
        let resolvedRole: 'OWNER' | 'OFFICER' | 'MEMBER' = config.role_name;
        
        // If they are an administrator in the Habbo group, we elevate their web permissions
        if (group.isAdmin) {
          if (config.role_name === 'MEMBER') {
            resolvedRole = 'OFFICER'; // Elevate standard group admins to Officer
          } else {
            resolvedRole = 'OWNER'; // Elevate higher groups admins to Owner
          }
        }

        // Compare roles priority (Owner > Officer > Member)
        const currentIdx = hierarchyOrder.indexOf(matchedRole.toLowerCase());
        const newIdx = hierarchyOrder.indexOf(resolvedRole.toLowerCase());

        if (newIdx < currentIdx || matchedRank === 'Grumete') {
          matchedRole = resolvedRole;
          matchedRank = config.rank_name;
        }
      }
    }

    // Parse motto for rank override
    const mottoLower = (userData.motto || '').toLowerCase();
    const MOTTO_RANK_MAP: Record<string, string> = {
      'soldado de primera': 'Soldado de Primera',
      'soldado de 1ra': 'Soldado de Primera',
      'cabo primero': 'Cabo Primero',
      'cabo 1ro': 'Cabo Primero',
      'sargento primero': 'Sargento Primero',
      'sargento 1ro': 'Sargento Primero',
      'sub-oficial': 'Sub-Oficial',
      'suboficial': 'Sub-Oficial',
      'oficial tercero': 'Oficial Tercero',
      '3er teniente': 'Oficial Tercero',
      '3er. teniente': 'Oficial Tercero',
      'oficial segundo': 'Oficial Segundo',
      '2do teniente': 'Oficial Segundo',
      '2do. teniente': 'Oficial Segundo',
      'oficial primero': 'Oficial Primero',
      '1er teniente': 'Oficial Primero',
      '1er. teniente': 'Oficial Primero',
      'sub-teniente': 'Sub-Teniente',
      'subteniente': 'Sub-Teniente',
      'teniente': 'Teniente',
      'capitán': 'Capitán',
      'capitan': 'Capitán',
      'mayor': 'Mayor',
      'teniente coronel': 'Teniente Coronel',
      'coronel': 'Coronel',
      'general de brigada': 'General de Brigada',
      'gral. de brigada': 'General de Brigada',
      'general de división': 'General de División',
      'general de division': 'General de División',
      'gral. de división': 'General de División',
      'gral. de division': 'General de División',
      'general de ejército': 'General de Ejército',
      'general de ejercito': 'General de Ejército',
      'gral. de ejército': 'General de Ejército',
      'gral. de ejercito': 'General de Ejército',
      'general del estado mayor': 'General del Estado Mayor',
      'secretario general': 'Secretario General',
      'director general': 'Director General',
      'líder dueño supremo': 'Líder Dueño Supremo',
      'lider dueno supremo': 'Líder Dueño Supremo',
      'tesorero ejecutivo': 'Líder Dueño Supremo',
      'fundador': 'Fundador',
      'dueño': 'Dueño',
      'dueno': 'Dueño',
      'grumete': 'Grumete',
      'soldado': 'Soldado',
      'cabo': 'Cabo',
      'sargento': 'Sargento'
    };

    const sortedKeywords = Object.keys(MOTTO_RANK_MAP).sort((a, b) => b.length - a.length);
    let matchedMottoRank: string | null = null;
    for (const kw of sortedKeywords) {
      if (mottoLower.includes(kw)) {
        matchedMottoRank = MOTTO_RANK_MAP[kw];
        break;
      }
    }

    if (matchedMottoRank) {
      matchedRank = matchedMottoRank;
      const rankToRole: Record<string, 'OWNER' | 'OFFICER' | 'MEMBER'> = {
        'Grumete': 'MEMBER', 'Soldado': 'MEMBER', 'Soldado de Primera': 'MEMBER',
        'Cabo': 'MEMBER', 'Cabo Primero': 'MEMBER', 'Sargento': 'MEMBER', 'Sargento Primero': 'MEMBER', 'Sub-Oficial': 'MEMBER',
        'Oficial Tercero': 'OFFICER', 'Oficial Segundo': 'OFFICER', 'Oficial Primero': 'OFFICER',
        'Sub-Teniente': 'OFFICER', 'Teniente': 'OFFICER', 'Capitán': 'OFFICER',
        'Mayor': 'OFFICER', 'Teniente Coronel': 'OFFICER', 'Coronel': 'OFFICER',
        'General de Brigada': 'OWNER', 'General de División': 'OWNER', 'General de Ejército': 'OWNER',
        'General del Estado Mayor': 'OWNER', 'Secretario General': 'OWNER', 'Director General': 'OWNER',
        'Dueño': 'OWNER', 'Fundador': 'OWNER', 'Líder Dueño Supremo': 'OWNER'
      };
      matchedRole = rankToRole[matchedRank] || 'MEMBER';
    }

    // Special bypass for Guss/development accounts or founders
    const lowercaseName = name.toLowerCase();
    if (lowercaseName === 'migue-lito13.-' || lowercaseName === '-lyeremi-' || lowercaseName === 'gusgus95mx') {
      matchedRole = 'OWNER';
    } else if (lowercaseName === 'alex-frezee') {
      matchedRole = 'OFFICER';
    }

    // 4. Save/Update in MySQL
    const existing = await query<any[]>(
      'SELECT id, role, rank_name FROM members WHERE unique_id = ? OR name = ?',
      [uniqueId, name]
    );

    let matchedId: number | null = null;
    if (existing.length > 0) {
      matchedId = existing[0].id;
      if (isProfilePrivate) {
        matchedRole = existing[0].role;
        matchedRank = existing[0].rank_name;
      }
    }

    if (matchedId !== null) {
      // Update by DB auto-increment ID
      await query(
        'UPDATE members SET name = ?, unique_id = ?, role = ?, figure = ?, rank_name = ? WHERE id = ?',
        [name, uniqueId, matchedRole, figure, matchedRank, matchedId]
      );
    } else {
      // Insert new member
      await query(
        'INSERT INTO members (name, unique_id, role, figure, rank_name, approved) VALUES (?, ?, ?, ?, ?, 1)',
        [name, uniqueId, matchedRole, figure, matchedRank]
      );
    }

    // Return the updated member object
    const [member] = await query<any[]>('SELECT * FROM members WHERE unique_id = ?', [uniqueId]);
    return member;
  },

  /**
   * Iterates through all registered members in the database
   * and synchronizes their latest Habbo profiles.
   */
  async syncAllMembers(): Promise<void> {
    console.log('Starting full database synchronization...');
    const members = await query<any[]>('SELECT name FROM members');
    
    for (const member of members) {
      try {
        console.log(`Syncing member: ${member.name}`);
        await this.syncUser(member.name);
        // Wait 1 second between requests to avoid rate limits on Habbo API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Failed to sync user "${member.name}":`, err);
      }
    }
    console.log('Full synchronization completed.');
  }
};
