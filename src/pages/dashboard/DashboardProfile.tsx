import React, { useState, useEffect } from 'react';
import { KeyRound, Check, Loader2 } from 'lucide-react';
import { habboService } from '../../services/habboService';

interface Member {
  id: number;
  name: string;
  rankName: string;
  role: 'OWNER' | 'OFFICER' | 'MEMBER';
  weekMinutes: number;
  totalMinutes: number;
  joinedAt: string;
}

export const DashboardProfile: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [memberData, setMemberData] = useState<Member | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bmt_session');
    if (savedSession) {
      const sess = JSON.parse(savedSession);
      setSession(sess);
      
      const token = localStorage.getItem('bmt_token');
      fetch('/api/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const found = data.find(m => m.name.toLowerCase() === sess.name.toLowerCase());
            if (found) {
              setMemberData(found);
            }
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 4) {
      setSettingsMessage({ text: 'La nueva contraseña debe tener al menos 4 caracteres.', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    setSettingsMessage(null);

    try {
      const token = localStorage.getItem('bmt_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setSettingsMessage({ text: 'Contraseña actualizada con éxito.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setSettingsMessage({ text: err.message || 'Error de red', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!session) return null;

  return (
    <div className="space-y-10" style={{ width: '100%', minWidth: 0 }}>
      {/* Profile Card */}
      <section className="dashboard-section card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-darker)',
            border: '2px solid var(--border-zinc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={habboService.getAvatarUrl(session.name, { size: 'l' })}
              alt={session.name}
              style={{ height: '110px', marginTop: '-15px', imageRendering: 'pixelated' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 className="section-title" style={{ marginBottom: '4px' }}>{session.name}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`badge-pill badge-${session.role.toLowerCase()}`}>
                {session.role === 'OWNER' ? 'Dueño' : session.role === 'OFFICER' ? 'Oficial' : 'Militar'}
              </span>
              {memberData && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <img
                    src={habboService.getBadgeUrl(habboService.getBadgeForRank(memberData.rankName || 'Grumete'))}
                    alt="Placa"
                    style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                  />
                  <strong>{memberData.rankName || 'Grumete'}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {memberData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '20px',
            marginTop: '8px'
          }}>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Esta semana</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--color-emerald)' }}>{formatMinutes(memberData.weekMinutes)}</strong>
            </div>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total acumulado</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>{formatMinutes(memberData.totalMinutes)}</strong>
            </div>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha de ingreso</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {new Date(memberData.joinedAt).toLocaleDateString()}
              </strong>
            </div>
          </div>
        )}
      </section>

      {/* Settings / Password Change Section */}
      <section className="dashboard-section card">
        <h2 className="section-title">
          <KeyRound className="text-amber" size={24} />
          Seguridad de la Cuenta
        </h2>
        <p className="section-subtitle-small">
          Cambia tu contraseña personal de acceso a la oficina.
        </p>

        {settingsMessage && (
          <div className={`alert ${settingsMessage.type === 'success' ? 'alert-info' : 'alert-danger'}`} style={{ marginTop: '12px' }}>
            {settingsMessage.type === 'success' && <Check size={16} className="text-emerald" />}
            <span>{settingsMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label">Contraseña Actual</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="Contraseña actual..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="Mínimo 4 caracteres..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary w-full" style={{ alignSelf: 'flex-start' }} disabled={isChangingPassword}>
            {isChangingPassword ? <Loader2 className="animate-spin" size={16} /> : 'Cambiar Contraseña'}
          </button>
        </form>
      </section>
    </div>
  );
};
