import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Search, Loader2, Check, RefreshCw, Clock, ShieldCheck, UserMinus, KeyRound } from 'lucide-react';
import { habboService } from '../../services/habboService';

interface Member {
  id: number;
  name: string;
  role: 'OWNER' | 'OFFICER' | 'MEMBER';
  figure: string;
  joinedAt: string;
  weekMinutes: number;
  totalMinutes: number;
  rankName?: string;
  approved?: number;
}

const MILITARY_RANKS = [
  // Reclutas
  'Grumete', 'Guardiamarina', 'Recluta', 'Cadete 1er Año', 'Cadete 2do Año', 'Cadete 3er Año', 'Cadete 4to Año', 'Instr. de Entren.',
  // Sub-Oficiales
  'Cabo', 'Sargento', 'Sargento Primero', 'Sgto. de Artilleria', 'Sargento Mayor', 'Brigada', 'Subteniente', 'Subteniente Mayor',
  // Oficiales
  '2do Teniente', '1er Teniente', 'Alférez', 'Alférez de Fragata', 'Coronel Oficial', 'Alférez de Navío', 'Capitán', 'Teniente de Navío', 'Cap. de Corbeta',
  // Oficiales Superiores
  'Mayor', 'Mayor Ejecutivo', 'Teniente Coronel', 'Capitán de Navío', 'Coronel', 'Cmdt. de División', 'Dir. de Invest.', 'Director de RRHH',
  // Generales
  'Gral. de Brigada', 'Gral. de División', 'Teniente Gral.', 'Gral. de Ejército', 'Capitán Gral.', 'Mayor Gral.',
  // Estado Mayor
  'Tesorero Ejecutivo', 'Secretario de Estado', 'Secretario Ejecutivo', 'Ministro de Defensa', 'Ministro de Justicia'
];

export const DashboardUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'pending' | 'add'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  
  // Form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'OWNER' | 'OFFICER' | 'MEMBER'>('MEMBER');
  const [newMemberRank, setNewMemberRank] = useState('Grumete');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('bmt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const refreshMembers = () => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((m: any) => ({
          ...m,
          weekMinutes: m.week_minutes !== undefined ? m.week_minutes : m.weekMinutes,
          totalMinutes: m.total_minutes !== undefined ? m.total_minutes : m.totalMinutes,
          joinedAt: m.joined_at !== undefined ? m.joined_at : m.joinedAt,
          rankName: m.rank_name !== undefined ? m.rank_name : m.rankName
        }));
        setMembers(mapped);
      })
      .catch(err => console.error(err));
  };

  const fetchPending = () => {
    fetch('/api/admin/pending', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((m: any) => ({
          ...m,
          weekMinutes: m.week_minutes !== undefined ? m.week_minutes : m.weekMinutes,
          totalMinutes: m.total_minutes !== undefined ? m.total_minutes : m.totalMinutes,
          joinedAt: m.joined_at !== undefined ? m.joined_at : m.joinedAt,
          rankName: m.rank_name !== undefined ? m.rank_name : m.rankName
        }));
        setPending(mapped);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshMembers();
    fetchPending();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    setIsLoading(true);
    setMessage(null);

    const targetName = newMemberName.trim();
    const lowercaseName = targetName.toLowerCase();

    // Check if already exists in active members
    const exists = members.some(m => m.name.toLowerCase() === lowercaseName);
    if (exists) {
      setMessage({ text: `El keko "${targetName}" ya está registrado como miembro activo.`, type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          username: targetName,
          role: newMemberRole,
          rankName: newMemberRank
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al registrar miembro');
      }

      const newMember = await response.json();
      setMessage({ text: `Miembro "${newMember.name}" agregado con éxito.`, type: 'success' });
      setNewMemberName('');
      setNewMemberRole('MEMBER');
      setNewMemberRank('Grumete');
      refreshMembers();
      setActiveTab('members');
    } catch (err: any) {
      setMessage({ text: err.message || 'Error al validar el keko en Habbo.es', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = (memberId: number, memberName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a "${memberName}" del batallón? Sus registros históricos también se desvincularán.`)) {
      fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar miembro');
          refreshMembers();
        })
        .catch(err => alert(err.message));
    }
  };

  const handleResetPassword = (memberId: number, memberName: string) => {
    const newPassword = window.prompt(`Introduce la nueva contraseña para "${memberName}":`);
    if (newPassword === null) return; // Cancelled
    if (newPassword.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    fetch(`/api/members/${memberId}/reset-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword: newPassword.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al restablecer la contraseña');
        alert(`Contraseña de "${memberName}" restablecida con éxito.`);
      })
      .catch(err => alert(err.message));
  };

  const handleChangeRole = (memberId: number, newRole: 'OWNER' | 'OFFICER' | 'MEMBER') => {
    fetch(`/api/members/${memberId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role: newRole })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cambiar el cargo');
        refreshMembers();
      })
      .catch(err => alert(err.message));
  };

  const handleChangeRank = (memberId: number, newRank: string) => {
    fetch(`/api/members/${memberId}/rank`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ rankName: newRank })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cambiar el rango');
        refreshMembers();
      })
      .catch(err => alert(err.message));
  };

  const handleApprove = (id: number, name: string) => {
    fetch(`/api/admin/approve/${id}`, {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al aprobar miembro');
        setMessage({ text: `Solicitud de "${name}" aprobada con éxito.`, type: 'success' });
        fetchPending();
        refreshMembers();
      })
      .catch(err => alert(err.message));
  };

  const handleReject = (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de rechazar la solicitud de "${name}"? Se eliminará de la base de datos.`)) return;

    fetch(`/api/admin/reject/${id}`, {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al rechazar solicitud');
        setMessage({ text: `Solicitud de "${name}" rechazada y eliminada.`, type: 'success' });
        fetchPending();
      })
      .catch(err => alert(err.message));
  };

  const handleSyncAll = () => {
    setIsLoading(true);
    fetch('/api/members/sync-all', {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al sincronizar');
        alert('Sincronización general iniciada en segundo plano. Los rangos se actualizarán al recargar en unos momentos.');
        setTimeout(refreshMembers, 3000);
      })
      .catch(err => alert(err.message))
      .finally(() => setIsLoading(false));
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatMinutes = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m}m`;
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <div className="section-title">
          <Users className="text-amber" size={24} />
          <h1>Administración de Personal</h1>
        </div>
        <p className="section-subtitle">
          Gestiona los miembros activos, aprueba nuevas solicitudes de registro y asigna rangos o cargos.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-link ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => { setActiveTab('members'); setMessage(null); }}
        >
          <Users size={16} />
          <span>Miembros Activos ({members.length})</span>
        </button>
        <button 
          className={`admin-tab-link ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pending'); setMessage(null); fetchPending(); }}
        >
          <Clock size={16} />
          <span>Solicitudes Pendientes ({pending.length})</span>
        </button>
        <button 
          className={`admin-tab-link ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => { setActiveTab('add'); setMessage(null); }}
        >
          <UserPlus size={16} />
          <span>Registrar Manual</span>
        </button>
      </div>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-info' : 'alert-danger'}`}>
          {message.type === 'success' && <Check size={16} className="text-emerald" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Active Members View */}
      {activeTab === 'members' && (
        <section className="fade-in">
          <div className="directory-header-row">
            <h2 className="section-title">Miembros del Batallón</h2>
            <div className="directory-actions">
              <button onClick={handleSyncAll} className="btn btn-secondary sync-btn" disabled={isLoading}>
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Sincronizar de Habbo
              </button>
              <div className="search-bar">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por keko..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input search-input"
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            {filteredMembers.length === 0 ? (
              <div className="empty-state">No se encontraron miembros activos.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Miembro</th>
                    <th>Cargo</th>
                    <th>Rango Militar</th>
                    <th>Ingreso</th>
                    <th>Semana</th>
                    <th>Total Acumulado</th>
                    <th style={{ width: '80px', textAlign: 'right' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="keko-cell">
                        <div className="table-avatar-wrapper">
                          <img
                            src={habboService.getAvatarUrl(member.name, { size: 'm' })}
                            alt={member.name}
                            className="table-avatar-img"
                          />
                        </div>
                        <span className="duty-keko-name">{member.name}</span>
                      </td>
                      <td>
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value as any)}
                          className="role-selector"
                        >
                          <option value="MEMBER">Militar</option>
                          <option value="OFFICER">Oficial</option>
                          <option value="OWNER">Dueño</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img 
                            src={habboService.getBadgeUrl(habboService.getBadgeForRank(member.rankName || 'Grumete'))} 
                            alt="Placa" 
                            className="rank-badge-inline"
                          />
                          <select
                            value={member.rankName || 'Grumete'}
                            onChange={(e) => handleChangeRank(member.id, e.target.value)}
                            className="role-selector"
                          >
                            {MILITARY_RANKS.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="text-emerald font-semibold">
                        {formatMinutes(member.weekMinutes)}
                      </td>
                      <td>
                        {formatMinutes(member.totalMinutes)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleResetPassword(member.id, member.name)}
                            className="btn-icon-warning"
                            title="Restablecer contraseña"
                          >
                            <KeyRound size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="btn-icon-danger"
                            title="Eliminar miembro"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Pending Requests View */}
      {activeTab === 'pending' && (
        <section className="fade-in card">
          <h2 className="section-subheading">
            <Clock size={20} className="text-amber" />
            Solicitudes de Registro Pendientes
          </h2>
          <p className="form-description">
            Estos usuarios se registraron en la web y esperan aprobación para poder iniciar sesión y registrar horas de servicio.
          </p>

          <div className="table-container">
            {pending.length === 0 ? (
              <div className="empty-state">No hay solicitudes de registro pendientes en este momento.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Keko</th>
                    <th>Fecha de Registro</th>
                    <th style={{ width: '200px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((reqUser) => (
                    <tr key={reqUser.id}>
                      <td className="keko-cell">
                        <div className="table-avatar-wrapper">
                          <img
                            src={habboService.getAvatarUrl(reqUser.name, { size: 'm' })}
                            alt={reqUser.name}
                            className="table-avatar-img"
                          />
                        </div>
                        <span className="duty-keko-name">{reqUser.name}</span>
                      </td>
                      <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {new Date(reqUser.joinedAt).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleApprove(reqUser.id, reqUser.name)}
                            className="btn btn-emerald btn-xs"
                          >
                            <ShieldCheck size={14} /> Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(reqUser.id, reqUser.name)}
                            className="btn btn-red btn-xs"
                          >
                            <UserMinus size={14} /> Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Register Manual View */}
      {activeTab === 'add' && (
        <div className="grid-2 fade-in">
          <section className="card">
            <h2 className="section-subheading">
              <UserPlus size={20} className="text-amber" />
              Agregar Miembro Directamente
            </h2>
            <p className="form-description">
              Registra un militar manualmente. Se creará la cuenta con estado **Aprobado** de forma inmediata.
            </p>

            <form onSubmit={handleAddMember} className="add-member-form">
              <div className="form-group">
                <label htmlFor="memberName" className="form-label">Nombre del keko en Habbo.es</label>
                <input
                  id="memberName"
                  type="text"
                  placeholder="Ej.: Migue-lito13.-"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="form-input"
                  autoComplete="off"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group flex-1">
                  <label htmlFor="memberRole" className="form-label">Cargo Administrativo</label>
                  <select
                    id="memberRole"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="form-input"
                    disabled={isLoading}
                  >
                    <option value="MEMBER">Militar (Estándar)</option>
                    <option value="OFFICER">Oficial (Admin)</option>
                    <option value="OWNER">Dueño (Todo)</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="memberRank" className="form-label">Rango Militar</label>
                  <select
                    id="memberRank"
                    value={newMemberRank}
                    onChange={(e) => setNewMemberRank(e.target.value)}
                    className="form-input"
                    disabled={isLoading}
                  >
                    {MILITARY_RANKS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading || !newMemberName.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Verificando en Habbo...
                  </>
                ) : (
                  'Registrar Miembro'
                )}
              </button>
            </form>
          </section>

          {/* Info panel */}
          <section className="card admin-info-card">
            <h2 className="section-subheading">Estructura de Cargos</h2>
            <div className="role-explainer-list">
              <div className="role-explainer-item">
                <span className="badge-pill badge-owner">Dueño</span>
                <p>Tiene control absoluto sobre la oficina. Puede gestionar miembros, modificar todos los rangos, registrar tiempos y reiniciar la caja de pagas semanal.</p>
              </div>
              <div className="role-explainer-item">
                <span className="badge-pill badge-officer">Oficial</span>
                <p>Ayuda en la administración. Puede agregar miembros, registrar el tiempo de servicio de otros militares y ver el reporte de pagas acumuladas.</p>
              </div>
              <div className="role-explainer-item">
                <span className="badge-pill badge-member">Militar</span>
                <p>Miembro del batallón. Solo tiene acceso a su panel personal "Mi Tiempo" para iniciar y terminar sus propios turnos de guardia.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .admin-tabs {
          display: flex;
          border-bottom: 2px solid var(--border-zinc);
          gap: 16px;
          margin-bottom: 10px;
        }

        .admin-tab-link {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 6px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          margin-bottom: -2px;
        }

        .admin-tab-link:hover {
          color: var(--text-primary);
        }

        .admin-tab-link.active {
          color: var(--color-amber);
          border-color: var(--color-amber);
        }

        .form-description {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .add-member-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group-row {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .form-group-row {
            flex-direction: column;
            gap: 0;
          }
        }

        .flex-1 {
          flex: 1;
        }

        .admin-info-card {
          border-left: 4px solid var(--color-amber);
        }

        .role-explainer-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 16px;
        }

        .role-explainer-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .role-explainer-item p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .directory-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .directory-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sync-btn {
          font-size: 0.85rem;
          padding: 8px 16px;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        @media (max-width: 640px) {
          .search-bar {
            width: 100%;
          }
          .directory-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 36px;
        }

        .role-selector {
          background-color: var(--bg-input);
          border: 1px solid var(--border-zinc);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          outline: none;
          max-width: 150px;
          transition: var(--transition-smooth);
        }

        .role-selector:focus {
          border-color: var(--color-amber);
        }

        .btn-icon-danger {
          background: none;
          border: 1px solid transparent;
          color: var(--text-muted);
          padding: 8px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-icon-danger:hover {
          color: var(--color-red);
          background-color: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .btn-icon-warning {
          background: none;
          border: 1px solid transparent;
          color: var(--text-muted);
          padding: 8px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-icon-warning:hover {
          color: var(--color-amber);
          background-color: rgba(251, 191, 36, 0.05);
          border-color: rgba(251, 191, 36, 0.15);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }

        .btn-xs {
          padding: 6px 12px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: var(--radius-sm);
        }

        .btn-red {
          background-color: var(--color-red);
          color: #fff;
        }

        .btn-red:hover {
          background-color: #ef4444;
        }

        .btn-emerald {
          background-color: var(--color-emerald);
          color: #fff;
        }

        .btn-emerald:hover {
          background-color: #10b981;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
