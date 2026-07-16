import express from 'express';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { query, initDb } from './db/db';
import { syncService } from './services/syncService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'bmt-super-secret-key-123';

app.use(cors());
app.use(express.json());

// Initialize Database on Startup
initDb();

// -------------------------------------------------------------
// Security & Hashing Utilities
// -------------------------------------------------------------
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// -------------------------------------------------------------
// JWT Middleware
// -------------------------------------------------------------
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Falta el token de autorización' });
  
  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    
    try {
      const users = await query<any[]>('SELECT approved, role FROM members WHERE id = ?', [decoded.id]);
      if (users.length === 0) {
        return res.status(403).json({ error: 'El usuario ya no existe' });
      }
      if (users[0].approved !== 1) {
        return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador' });
      }
      
      req.user = {
        ...decoded,
        role: users[0].role
      };
      next();
    } catch (dbErr) {
      return res.status(500).json({ error: 'Error interno de autenticación' });
    }
  });
}

// -------------------------------------------------------------
// Habbo Proxy API
// -------------------------------------------------------------
app.get('/api/habbo/users', async (req, res) => {
  const name = req.query.name as string;
  if (!name) return res.status(400).json({ error: 'Falta el parámetro "name"' });

  try {
    const response = await fetch(`https://www.habbo.es/api/public/users?name=${encodeURIComponent(name)}`);
    if (response.status === 404) {
      return res.status(404).json({ error: 'Usuario no encontrado en Habbo.es' });
    }
    if (!response.ok) {
      return res.status(500).json({ error: 'Error del servidor de Habbo.es' });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo conectar a Habbo.es' });
  }
});

// -------------------------------------------------------------
// Auth API
// -------------------------------------------------------------
// -------------------------------------------------------------
// Auth API
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Falta el usuario o la contraseña' });
  }

  const trimmedUsername = username.trim();
  if (password.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
  }

  try {
    // 1. Check if user exists on Habbo.es
    const habboUrl = `https://www.habbo.es/api/public/users?name=${encodeURIComponent(trimmedUsername)}`;
    const habboResponse = await fetch(habboUrl);
    if (habboResponse.status === 404) {
      return res.status(404).json({ error: `El keko "${trimmedUsername}" no existe en Habbo.es` });
    }
    if (!habboResponse.ok) {
      return res.status(500).json({ error: 'No se pudo conectar con el servidor de Habbo.es' });
    }
    const habboData = await habboResponse.json();
    const uniqueId = habboData.uniqueId;
    const figure = habboData.figureString;
    const officialName = habboData.name; // Keep official casing

    // 2. Check if already exists in DB
    const existing = await query<any[]>('SELECT id, password_hash, approved, role FROM members WHERE name = ?', [officialName]);
    const passwordHash = hashPassword(password);

    if (existing.length > 0) {
      const member = existing[0];
      if (member.password_hash) {
        return res.status(400).json({ error: 'Este keko ya está registrado' });
      }

      // Claiming legacy seeded account
      // Only main owners/leaders are auto-approved on registration
      const isCore = ['migue-lito13.-', '-lyeremi-', 'gusgus95mx', 'guss'].includes(officialName.toLowerCase());
      
      const nextApproved = isCore ? 1 : 0;
      await query(
        'UPDATE members SET password_hash = ?, approved = ?, figure = ? WHERE id = ?',
        [passwordHash, nextApproved, figure, member.id]
      );

      return res.json({
        message: nextApproved === 1 
          ? 'Registro completado con éxito. Ya puedes iniciar sesión.' 
          : 'Registro completado. Tu cuenta está pendiente de aprobación por un administrador.'
      });
    }

    // New member registration (starts as MEMBER and pending approval)
    await query(
      'INSERT INTO members (name, unique_id, role, figure, rank_name, password_hash, approved) VALUES (?, ?, "MEMBER", ?, "Grumete", ?, 0)',
      [officialName, uniqueId, figure, passwordHash]
    );

    return res.json({
      message: 'Registro completado. Tu cuenta está pendiente de aprobación por un administrador.'
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Error en el proceso de registro' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Falta el usuario o la contraseña' });
  }

  try {
    const members = await query<any[]>('SELECT * FROM members WHERE LOWER(name) = LOWER(?)', [username.trim()]);
    if (members.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const member = members[0];
    if (!member.password_hash) {
      return res.status(401).json({ error: 'Esta cuenta aún no ha sido registrada con contraseña. Regístrala en la pestaña "Registrarse" primero.' });
    }

    const passwordMatches = verifyPassword(password, member.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    if (member.approved !== 1) {
      return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador' });
    }

    // Sync latest Habbo details in background
    syncService.syncUser(member.name).catch(e => console.error('Background sync failed:', e));

    const token = jwt.sign(
      { id: member.id, name: member.name, role: member.role, figure: member.figure },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      session: {
        name: member.name,
        role: member.role,
        figure: member.figure,
        loginTime: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Error en el proceso de autenticación' });
  }
});

app.post('/api/auth/change-password', authenticateToken, async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Falta la contraseña actual o la nueva' });
  }
  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });
  }

  try {
    const members = await query<any[]>('SELECT id, password_hash FROM members WHERE id = ?', [req.user.id]);
    if (members.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const member = members[0];
    const passwordMatches = verifyPassword(currentPassword, member.password_hash);
    if (!passwordMatches) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    const newHash = hashPassword(newPassword);
    await query('UPDATE members SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    return res.json({ success: true, message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

// Development bypass
app.post('/api/auth/bypass', async (req, res) => {
  const { username } = req.body;
  if (!username || username.toLowerCase() !== 'guss') {
    return res.status(400).json({ error: 'Bypass no autorizado' });
  }

  try {
    const uniqueId = 'mock-guss-id';
    const name = 'Guss';
    const figure = 'hr-115-42.hd-195-2.ch-3030-82.lg-275-1408.sh-300-64';
    const role = 'OWNER';
    const rankName = 'Ministro de Defensa';

    // Ensure user is in database
    const existing = await query<any[]>('SELECT id FROM members WHERE unique_id = ?', [uniqueId]);
    let memberId: number;

    if (existing.length > 0) {
      memberId = existing[0].id;
      await query(
        'UPDATE members SET name = ?, role = ?, figure = ?, rank_name = ? WHERE unique_id = ?',
        [name, role, figure, rankName, uniqueId]
      );
    } else {
      const result = await query(
        'INSERT INTO members (name, unique_id, role, figure, rank_name) VALUES (?, ?, ?, ?, ?)',
        [name, uniqueId, role, figure, rankName]
      );
      memberId = (result as any).insertId;
    }

    const token = jwt.sign(
      { id: memberId, name, role, figure },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      session: {
        name,
        role,
        figure,
        loginTime: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Error en el bypass de desarrollo' });
  }
});

// -------------------------------------------------------------
// Admin Pending Approvals API
// -------------------------------------------------------------
app.get('/api/admin/pending', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  try {
    const pending = await query('SELECT * FROM members WHERE approved = 0 ORDER BY name ASC');
    return res.json(pending);
  } catch (err) {
    return res.status(500).json({ error: 'Error al consultar solicitudes pendientes' });
  }
});

app.post('/api/admin/approve/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  try {
    await query('UPDATE members SET approved = 1 WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al aprobar miembro' });
  }
});

app.post('/api/admin/reject/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  try {
    await query('DELETE FROM members WHERE id = ? AND approved = 0', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al rechazar solicitud' });
  }
});

// -------------------------------------------------------------
// Floods API
// -------------------------------------------------------------
app.get('/api/floods', async (req, res) => {
  try {
    const floods = await query('SELECT * FROM floods ORDER BY id ASC');
    return res.json(floods);
  } catch (err) {
    return res.status(500).json({ error: 'Error al consultar floods' });
  }
});

app.post('/api/floods', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { category, content } = req.body;
  if (!category || !content) {
    return res.status(400).json({ error: 'Falta la categoría o el contenido del flood' });
  }
  try {
    await query('INSERT INTO floods (category, content) VALUES (?, ?)', [category, content]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear flood' });
  }
});

app.put('/api/floods/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  const { category, content } = req.body;
  if (!category || !content) {
    return res.status(400).json({ error: 'Falta la categoría o el contenido del flood' });
  }
  try {
    await query('UPDATE floods SET category = ?, content = ? WHERE id = ?', [category, content, id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar flood' });
  }
});

app.delete('/api/floods/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  try {
    await query('DELETE FROM floods WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar flood' });
  }
});

// -------------------------------------------------------------
// Members API
// -------------------------------------------------------------
app.get('/api/members', async (req, res) => {
  try {
    const members = await query('SELECT * FROM members WHERE approved = 1 ORDER BY name ASC');
    return res.json(members);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error al consultar miembros' });
  }
});

app.post('/api/members', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { username, role, rankName } = req.body;
  if (!username) return res.status(400).json({ error: 'Falta el nombre de usuario' });

  try {
    // syncUser fetches details from Habbo and creates/updates user in DB
    const member = await syncService.syncUser(username);
    
    // If specific role or rankName was requested, update them
    if (role || rankName) {
      await query(
        'UPDATE members SET role = COALESCE(?, role), rank_name = COALESCE(?, rank_name) WHERE id = ?',
        [role, rankName, member.id]
      );
      member.role = role || member.role;
      member.rank_name = rankName || member.rank_name;
    }

    return res.json(member);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error al agregar miembro' });
  }
});

app.put('/api/members/:id/role', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'Falta el rol' });

  try {
    await query('UPDATE members SET role = ? WHERE id = ?', [role, id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar el cargo' });
  }
});

app.put('/api/members/:id/rank', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  const { rankName } = req.body;
  if (!rankName) return res.status(400).json({ error: 'Falta el rango' });

  try {
    await query('UPDATE members SET rank_name = ? WHERE id = ?', [rankName, id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar el rango' });
  }
});

app.put('/api/members/:id/reset-password', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'Falta la nueva contraseña' });

  try {
    const passwordHash = hashPassword(newPassword);
    await query('UPDATE members SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    return res.json({ success: true, message: 'Contraseña restablecida con éxito' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

app.delete('/api/members/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'OWNER' && req.user.role !== 'OFFICER') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  const { id } = req.params;
  try {
    await query('DELETE FROM members WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar miembro' });
  }
});

app.post('/api/members/sync-all', async (req, res) => {
  // Trigger full sync in background to avoid timeout
  syncService.syncAllMembers();
  return res.status(202).json({ message: 'Sincronización general iniciada en segundo plano.' });
});

// -------------------------------------------------------------
// Duty API (Protected)
// -------------------------------------------------------------
app.get('/api/duties/active', async (req, res) => {
  try {
    const active = await query(
      `SELECT d.*, m.name as userName, m.role, m.figure, m.rank_name as rankName 
       FROM active_duties d 
       JOIN members m ON d.member_id = m.id`
    );
    return res.json(active);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener miembros en servicio' });
  }
});

app.get('/api/duties/me', authenticateToken, async (req: any, res) => {
  try {
    const active = await query<any[]>(
      'SELECT * FROM active_duties WHERE member_id = ?',
      [req.user.id]
    );
    if (active.length > 0) {
      return res.json(active[0]);
    }
    return res.json(null);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener tu servicio' });
  }
});

app.post('/api/duties/start', authenticateToken, async (req: any, res) => {
  const { memberId, note } = req.body;
  
  // Officers can start duties for others, standard members only for themselves
  const targetMemberId = memberId ? Number(memberId) : req.user.id;
  
  if (targetMemberId !== req.user.id && req.user.role === 'MEMBER') {
    return res.status(403).json({ error: 'No tienes permiso para iniciar el servicio de otro miembro' });
  }

  try {
    // Check if already active
    const active = await query<any[]>('SELECT id FROM active_duties WHERE member_id = ?', [targetMemberId]);
    if (active.length > 0) {
      return res.status(400).json({ error: 'El miembro ya tiene un turno en servicio activo' });
    }

    const startedAt = new Date();
    await query(
      'INSERT INTO active_duties (member_id, started_at, accrued_ms, status, note) VALUES (?, ?, 0, "running", ?)',
      [targetMemberId, startedAt, note || null]
    );

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al iniciar servicio' });
  }
});

app.post('/api/duties/:id/pause', authenticateToken, async (req: any, res) => {
  const { id } = req.params;

  try {
    const [duty] = await query<any[]>('SELECT * FROM active_duties WHERE id = ?', [id]);
    if (!duty) return res.status(404).json({ error: 'Servicio no encontrado' });

    if (duty.member_id !== req.user.id && req.user.role === 'MEMBER') {
      return res.status(403).json({ error: 'No tienes permiso para modificar este servicio' });
    }

    if (duty.status === 'running' && duty.started_at) {
      const elapsed = new Date().getTime() - new Date(duty.started_at).getTime();
      const newAccrued = BigInt(duty.accrued_ms) + BigInt(elapsed);
      
      await query(
        'UPDATE active_duties SET status = "paused", accrued_ms = ?, started_at = NULL WHERE id = ?',
        [newAccrued.toString(), id]
      );
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al pausar servicio' });
  }
});

app.post('/api/duties/:id/resume', authenticateToken, async (req: any, res) => {
  const { id } = req.params;

  try {
    const [duty] = await query<any[]>('SELECT * FROM active_duties WHERE id = ?', [id]);
    if (!duty) return res.status(404).json({ error: 'Servicio no encontrado' });

    if (duty.member_id !== req.user.id && req.user.role === 'MEMBER') {
      return res.status(403).json({ error: 'No tienes permiso para modificar este servicio' });
    }

    if (duty.status === 'paused') {
      const startedAt = new Date();
      await query(
        'UPDATE active_duties SET status = "running", started_at = ? WHERE id = ?',
        [startedAt, id]
      );
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al reanudar servicio' });
  }
});

app.post('/api/duties/:id/terminate', authenticateToken, async (req: any, res) => {
  const { id } = req.params;

  try {
    const [duty] = await query<any[]>('SELECT * FROM active_duties WHERE id = ?', [id]);
    if (!duty) return res.status(404).json({ error: 'Servicio no encontrado' });

    if (duty.member_id !== req.user.id && req.user.role === 'MEMBER') {
      return res.status(403).json({ error: 'No tienes permiso para finalizar este servicio' });
    }

    // Calculate total elapsed ms
    let elapsedMs = BigInt(duty.accrued_ms);
    let startTimestamp = duty.started_at;
    
    if (duty.status === 'running' && duty.started_at) {
      const elapsed = new Date().getTime() - new Date(duty.started_at).getTime();
      elapsedMs += BigInt(elapsed);
    } else if (!startTimestamp) {
      // Fallback started_at if paused
      startTimestamp = new Date().toISOString();
    }

    const elapsedMinutes = Math.max(1, Math.round(Number(elapsedMs) / (1000 * 60)));

    // 1. Log to history
    await query(
      'INSERT INTO duty_logs (member_id, started_at, ended_at, minutes, note) VALUES (?, ?, ?, ?, ?)',
      [duty.member_id, startTimestamp, new Date(), elapsedMinutes, duty.note]
    );

    // 2. Update member cumulative minutes
    await query(
      'UPDATE members SET week_minutes = week_minutes + ?, total_minutes = total_minutes + ? WHERE id = ?',
      [elapsedMinutes, elapsedMinutes, duty.member_id]
    );

    // 3. Delete active duty
    await query('DELETE FROM active_duties WHERE id = ?', [id]);

    return res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Error al terminar servicio' });
  }
});

app.post('/api/duties/:id/cancel', authenticateToken, async (req: any, res) => {
  const { id } = req.params;

  try {
    const [duty] = await query<any[]>('SELECT * FROM active_duties WHERE id = ?', [id]);
    if (!duty) return res.status(404).json({ error: 'Servicio no encontrado' });

    if (duty.member_id !== req.user.id && req.user.role === 'MEMBER') {
      return res.status(403).json({ error: 'No tienes permiso para cancelar este servicio' });
    }

    await query('DELETE FROM active_duties WHERE id = ?', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al cancelar servicio' });
  }
});

// -------------------------------------------------------------
// Payroll API (Protected for Officers/Owners)
// -------------------------------------------------------------
app.post('/api/pay/reset', authenticateToken, async (req: any, res) => {
  if (req.user.role === 'MEMBER') {
    return res.status(403).json({ error: 'No tienes permiso para reiniciar las nóminas' });
  }

  try {
    await query('UPDATE members SET week_minutes = 0');
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error al reiniciar la semana laboral' });
  }
});

// -------------------------------------------------------------
// Serve static React files in production
// -------------------------------------------------------------
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
