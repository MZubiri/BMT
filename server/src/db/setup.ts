import { initDb, query } from './db';
import { syncService } from '../services/syncService';
import dotenv from 'dotenv';

dotenv.config();

async function runSetup() {
  console.log('--- STARTING DATABASE & SYNC SETUP ---');
  
  try {
    // 1. Initialize schema and insert group ranks
    await initDb();

    // 2. Pre-insert core members to be synced
    const coreMembers = [
      { name: 'Migue-lito13.-', uniqueId: 'hhes-42f087b05449345e95f7ec4dd91dc7ee', role: 'OWNER', rank: 'Líder Dueño Supremo' },
      { name: '-lYeremi-', uniqueId: 'hhes-7235a7723ff14753e88e344a7723ff14', role: 'OWNER', rank: 'Líder Dueño Supremo' },
      { name: 'Alex-frezee', uniqueId: 'hhes-frezee-id-12345', role: 'OFFICER', rank: 'Oficial' },
      { name: 'Guss', uniqueId: 'hhes-b30a20a7d20455ae279f49e39d5676f4', role: 'OWNER', rank: 'Ministro de Defensa' }
    ];

    for (const m of coreMembers) {
      const existing = await query<any[]>('SELECT id FROM members WHERE name = ?', [m.name]);
      if (existing.length === 0) {
        console.log(`Pre-inserting core member placeholder: ${m.name}`);
        await query(
          'INSERT INTO members (name, unique_id, role, figure, rank_name) VALUES (?, ?, ?, "hr-115-42", ?)',
          [m.name, m.uniqueId, m.role, m.rank]
        );
      }
    }

    // 3. Trigger automatic Habbo group and profile synchronization for all members
    console.log('Running Habbo synchronization for all members...');
    await syncService.syncAllMembers();
    
    console.log('--- SETUP AND SYNCHRONIZATION COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

runSetup();
