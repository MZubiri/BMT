export interface HabboBadge {
  badgeIndex: number;
  code: string;
  name: string;
  description: string;
}

export interface HabboUser {
  uniqueId: string;
  name: string;
  figureString: string;
  motto: string;
  online: boolean;
  profileVisible: boolean;
  memberSince?: string;
  currentLevel?: number;
  starGemCount?: number;
  selectedBadges?: HabboBadge[];
}

/**
 * Service to interact with the official Habbo.es public APIs
 */
export const habboService = {
  /**
   * Fetches a Habbo user's public profile data.
   * Uses the local development server proxy to avoid CORS.
   */
  async getUserByUsername(username: string): Promise<HabboUser> {
    const trimmedName = username.trim();
    if (!trimmedName) {
      throw new Error('El nombre de usuario no puede estar vacío');
    }

    try {
      // /api/habbo will be proxied to https://www.habbo.es/api/public by Vite
      const url = `/api/habbo/users?name=${encodeURIComponent(trimmedName)}`;
      const response = await fetch(url);

      if (response.status === 404) {
        throw new Error(`El keko "${trimmedName}" no existe en Habbo.es`);
      }

      if (!response.ok) {
        throw new Error('No se pudo conectar con los servidores de Habbo');
      }

      const data = await response.json();
      return data as HabboUser;
    } catch (error: any) {
      console.error('Error fetching Habbo user:', error);
      throw new Error(error.message || 'Error al verificar el keko en Habbo.es');
    }
  },

  /**
   * Generates the URL for a Habbo avatar image.
   */
  getAvatarUrl(username: string, options: { size?: 'm' | 'l'; direction?: number; headDirection?: number; action?: string; gesture?: string } = {}): string {
    const {
      size = 'l',
      direction = 2,
      headDirection = 3,
      action = 'std',
      gesture = 'sml'
    } = options;
    
    return `https://www.habbo.es/habbo-imaging/avatarimage?user=${encodeURIComponent(username)}&direction=${direction}&head_direction=${headDirection}&size=${size}&action=${action}&gesture=${gesture}`;
  },

  /**
   * Generates the URL for a Habbo badge image (e.g. group badge).
   */
  getBadgeUrl(badgeCode: string): string {
    if (!badgeCode) return '';
    // If it is a group badge code (long string) vs standard user badge code (e.g. AD101)
    if (badgeCode.length > 10) {
      return `https://www.habbo.es/habbo-imaging/badge/${badgeCode}.gif`;
    }
    return `https://images.habbo.com/c_images/album1584/${badgeCode}.png`;
  },

  /**
   * Returns the badge code corresponding to the rank name's tier.
   */
  getBadgeForRank(rankName: string): string {
    const name = (rankName || '').toLowerCase();
    
    // Estado Mayor
    if (name.includes('tesorero') || name.includes('secretario') || name.includes('ministro') || name.includes('estado mayor')) {
      return 'b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642';
    }
    // Generales
    if (name.includes('gral') || name.includes('general') || name.includes('ejército')) {
      return 'b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79';
    }
    // Oficiales Superiores
    if (name.includes('mayor') || name.includes('cmdt') || name.includes('coronel') || name.includes('dir')) {
      return 'b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7';
    }
    // Oficiales
    if (name.includes('teniente') || name.includes('alférez') || name.includes('capitán') || name.includes('navío') || name.includes('corbeta')) {
      return 'b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622';
    }
    // Sub-Oficiales
    if (name.includes('cabo') || name.includes('sargento') || name.includes('brigada') || name.includes('sgto') || name.includes('subteniente')) {
      return 'b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14';
    }
    // Reclutas (default)
    return 'b09134s02155s36047s44134t27114e862510ff77289cfa52c2552470f2105';
  }
};
