import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, X, UserPlus, Users } from 'lucide-react';
import { habboService } from '../../services/habboService';
import type { UserSession } from './DashboardLayout';

interface ActiveDuty {
  id: number;
  userName: string;
  figure: string;
  role: string;
  startedAt: string | null; // ISO string
  accruedMs: number;
  status: 'running' | 'paused';
  note: string;
  rankName?: string;
}

interface Member {
  id: number;
  name: string;
  role: string;
  figure: string;
  joinedAt: string;
  weekMinutes: number;
  totalMinutes: number;
  rankName?: string;
}

export const Dashboard: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeDuties, setActiveDuties] = useState<ActiveDuty[]>([]);
  const [myDuty, setMyDuty] = useState<ActiveDuty | null>(null);
  const [note, setNote] = useState('');
  

  // Officer state to start someone else's time
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [memberNote, setMemberNote] = useState('');

  // Rerender trigger for the live clock
  const [, setTimeTick] = useState(0);

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

  const refreshDuties = () => {
    fetch('/api/duties/active')
      .then(res => res.json())
      .then(data => setActiveDuties(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    // Load current session
    const savedSession = localStorage.getItem('bmt_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }

    refreshMembers();
    refreshDuties();
  }, []);

  // Update myDuty when activeDuties or session changes
  useEffect(() => {
    if (session) {
      const found = activeDuties.find(d => d.userName.toLowerCase() === session.name.toLowerCase());
      setMyDuty(found || null);
    }
  }, [activeDuties, session]);

  // Timer interval to force rerenders for the clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to format ms into HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hrs = Math.floor(totalSecs / 3600);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Helper to calculate total active milliseconds for a duty
  const getElapsedMs = (duty: ActiveDuty) => {
    if (duty.status === 'paused' || !duty.startedAt) {
      return Number(duty.accruedMs);
    }
    const start = new Date(duty.startedAt).getTime();
    const now = new Date().getTime();
    return Number(duty.accruedMs) + (now - start);
  };

  // Action: Start my time
  const handleStartDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    fetch('/api/duties/start', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ note: note.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al iniciar servicio');
        setNote('');
        refreshDuties();
      })
      .catch(err => alert(err.message));
  };

  // Action: Pause time
  const handlePauseDuty = (dutyId: number) => {
    fetch(`/api/duties/${dutyId}/pause`, {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al pausar el servicio');
        refreshDuties();
      })
      .catch(err => alert(err.message));
  };

  // Action: Resume time
  const handleResumeDuty = (dutyId: number) => {
    fetch(`/api/duties/${dutyId}/resume`, {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al reanudar el servicio');
        refreshDuties();
      })
      .catch(err => alert(err.message));
  };

  // Action: Terminate service (save minutes to history)
  const handleTerminateDuty = (dutyId: number) => {
    fetch(`/api/duties/${dutyId}/terminate`, {
      method: 'POST',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al terminar turno');
        refreshDuties();
        refreshMembers();
      })
      .catch(err => alert(err.message));
  };

  // Action: Cancel time (discard session)
  const handleCancelDuty = (dutyId: number) => {
    if (window.confirm('¿Estás seguro de cancelar tu tiempo de servicio actual? Se perderán las horas acumuladas en esta sesión.')) {
      fetch(`/api/duties/${dutyId}/cancel`, {
        method: 'POST',
        headers: getHeaders()
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al cancelar el servicio');
          refreshDuties();
        })
        .catch(err => alert(err.message));
    }
  };

  // Officer action: Start time for someone else
  const handleStartMemberDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    fetch('/api/duties/start', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ memberId: selectedMemberId, note: memberNote.trim() })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al iniciar servicio');
        setSelectedMemberId('');
        setMemberNote('');
        refreshDuties();
      })
      .catch(err => alert(err.message));
  };



  if (!session) return null;

  // Filter members that are NOT currently active on duty and NOT the current user
  const activeUsernames = new Set(activeDuties.map(d => d.userName.toLowerCase()));
  const availableMembers = members.filter(m => 
    !activeUsernames.has(m.name.toLowerCase()) && 
    m.name.toLowerCase() !== session.name.toLowerCase()
  );

  const isOfficerOrOwner = session.role === 'OWNER' || session.role === 'OFFICER';
  
  // Find current user's minutes info
  const myMemberRecord = members.find(m => m.name.toLowerCase() === session.name.toLowerCase());
  const myWeekMinutes = myMemberRecord ? myMemberRecord.weekMinutes : 0;
  const myTotalMinutes = myMemberRecord ? myMemberRecord.totalMinutes : 0;

  const formatMinutes = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m}m`;
  };

  return (
    <div className="space-y-10">
      {/* 1. Timer / Personal Tracker Section */}
      <section className="dashboard-section card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            <Clock className="text-amber" size={24} />
            Mi Tiempo de Servicio
          </h2>
          {myMemberRecord && myMemberRecord.rankName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <img 
                src={habboService.getBadgeUrl(habboService.getBadgeForRank(myMemberRecord.rankName))} 
                alt="Mi Placa" 
                style={{ width: '24px', height: '24px', objectFit: 'contain', imageRendering: 'pixelated' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {myMemberRecord.rankName}
              </span>
            </div>
          )}
        </div>
        
        <div className="timer-workspace">
          {!myDuty ? (
            /* Idle: duty not started */
            <form onSubmit={handleStartDuty} className="timer-idle-form">
              <p className="timer-description">
                No tienes ningún tiempo en marcha. Inicia tu servicio cuando entres en la base militar de Habbo.
              </p>
              <div className="form-group">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nota opcional (ej.: estoy custodiando la puerta principal)"
                  maxLength={150}
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Play size={16} /> Iniciar tiempo de servicio
              </button>
            </form>
          ) : (
            /* Active duty state */
            <div className="timer-active-area">
              <div className="timer-status-row">
                <div className={`timer-display ${myDuty.status === 'running' ? 'timer-running' : 'timer-paused'}`}>
                  {myDuty.status === 'running' ? (
                    <div className="pulse-indicator">
                      <span className="pulse-ring"></span>
                      <span className="pulse-core"></span>
                    </div>
                  ) : (
                    <span className="paused-dot"></span>
                  )}
                  {formatTime(getElapsedMs(myDuty))}
                </div>
                <div className="timer-state-text">
                  {myDuty.status === 'running' ? 'En servicio activo' : 'Servicio en pausa'}
                  {myDuty.note && <span className="timer-note"> · "{myDuty.note}"</span>}
                </div>
              </div>

              <div className="timer-actions-row">
                {myDuty.status === 'running' ? (
                  <button onClick={() => handlePauseDuty(myDuty.id)} className="btn btn-secondary">
                    <Pause size={16} /> Pausar
                  </button>
                ) : (
                  <button onClick={() => handleResumeDuty(myDuty.id)} className="btn btn-success">
                    <Play size={16} /> Reanudar
                  </button>
                )}
                
                <button onClick={() => handleTerminateDuty(myDuty.id)} className="btn btn-danger">
                  <Square size={16} /> Terminar
                </button>
                
                <button onClick={() => handleCancelDuty(myDuty.id)} className="btn btn-secondary btn-cancel">
                  <X size={16} /> Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accrued totals */}
        <div className="timer-stats-footer">
          <div>
            Esta semana: <strong className="text-amber">{formatMinutes(myWeekMinutes)}</strong>
          </div>
          <div className="stats-separator"></div>
          <div>
            Total acumulado: <strong className="text-secondary">{formatMinutes(myTotalMinutes)}</strong>
          </div>
        </div>
      </section>

      {/* Settings / Password Change Section */}

      {/* 2. Admin Member Duty Starter (Visible only to Officers/Owners) */}
      {isOfficerOrOwner && (
        <section className="dashboard-section card">
          <h2 className="section-title text-amber">
            <UserPlus size={24} />
            Registrar Servicio de un Miembro
          </h2>
          <p className="section-subtitle-small">
            Inicia el tiempo de servicio de otro militar si este no puede registrarlo personalmente.
          </p>

          <form onSubmit={handleStartMemberDuty} className="admin-duty-form">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="form-input select-member"
              required
            >
              <option value="">Elige un miembro...</option>
              {availableMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>

            <input
              type="text"
              value={memberNote}
              onChange={(e) => setMemberNote(e.target.value)}
              placeholder="Nota opcional (ej.: Oficial de Guardia)"
              className="form-input input-note"
            />

            <button type="submit" className="btn btn-primary" disabled={!selectedMemberId}>
              <Play size={16} /> Iniciar tiempo
            </button>
          </form>
        </section>
      )}

      {/* 3. On Duty Now Table */}
      <section className="dashboard-section">
        <div className="section-title-wrapper">
          <h2 className="section-title">
            <Users className="text-amber" size={24} />
            En Servicio Ahora
          </h2>
          <span className="badge-count font-pixel">{activeDuties.length}</span>
        </div>

        {activeDuties.length === 0 ? (
          <div className="table-container">
            <div className="empty-state">No hay ningún miembro en servicio activo en este momento.</div>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Keko</th>
                    <th>Cargo</th>
                    <th>Hora Inicio</th>
                    <th>Tiempo Transcurrido</th>
                    {isOfficerOrOwner && <th style={{ width: '120px' }}>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {activeDuties.map((duty) => (
                    <tr key={duty.id}>
                      <td className="keko-cell">
                        <div className="table-avatar-wrapper">
                          <img
                            src={habboService.getAvatarUrl(duty.userName, { size: 'm' })}
                            alt={duty.userName}
                            className="table-avatar-img"
                          />
                        </div>
                        <span className="duty-keko-name">{duty.userName}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img 
                              src={habboService.getBadgeUrl(habboService.getBadgeForRank(duty.rankName || 'Grumete'))} 
                              alt="Placa" 
                              className="rank-badge-inline"
                            />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{duty.rankName || 'Grumete'}</span>
                          </div>
                          <div>
                            <span className={`badge-pill badge-${duty.role.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                              {duty.role === 'OWNER' ? 'Dueño' : duty.role === 'OFFICER' ? 'Oficial' : 'Militar'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {duty.startedAt ? new Date(duty.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pausado'}
                      </td>
                      <td className={duty.status === 'running' ? 'text-emerald font-semibold' : 'text-amber font-semibold'}>
                        {formatTime(getElapsedMs(duty))}
                      </td>
                      {isOfficerOrOwner && (
                        <td>
                          <button
                            onClick={() => handleTerminateDuty(duty.id)}
                            className="btn btn-danger btn-xs"
                            title="Forzar fin de turno"
                          >
                            <Square size={12} /> Terminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards list */}
            <div className="mobile-cards-list">
              {activeDuties.map((duty) => (
                <div key={duty.id} className="member-mobile-card card" style={{ borderLeft: duty.status === 'running' ? '4px solid var(--color-emerald)' : '4px solid var(--color-amber)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="table-avatar-wrapper">
                      <img
                        src={habboService.getAvatarUrl(duty.userName, { size: 'm' })}
                        alt={duty.userName}
                        className="table-avatar-img"
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{duty.userName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <img 
                          src={habboService.getBadgeUrl(habboService.getBadgeForRank(duty.rankName || 'Grumete'))} 
                          alt="Placa" 
                          style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                        />
                        <span>{duty.rankName || 'Grumete'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Hora Inicio:</span>
                      <span className="text-zinc-300">
                        {duty.startedAt ? new Date(duty.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pausado'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tiempo Transcurrido:</span>
                      <span className={duty.status === 'running' ? 'text-emerald font-semibold' : 'text-amber font-semibold'}>
                        {formatTime(getElapsedMs(duty))}
                      </span>
                    </div>
                  </div>

                  {isOfficerOrOwner && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
                      <button
                        onClick={() => handleTerminateDuty(duty.id)}
                        className="btn btn-danger btn-xs"
                        style={{ height: '32px' }}
                      >
                        <Square size={12} /> Terminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        .space-y-10 > * + * {
          margin-top: 40px;
        }

        .timer-workspace {
          padding: 16px 0 24px;
          border-bottom: 1px solid var(--border-zinc);
          margin-bottom: 16px;
        }

        .timer-description {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .timer-idle-form {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .timer-idle-form .form-group {
          width: 100%;
          max-width: 500px;
        }

        .timer-active-area {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timer-status-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .timer-state-text {
          font-size: 1rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .timer-note {
          color: var(--text-muted);
          font-style: italic;
          font-weight: 400;
        }

        .timer-actions-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-cancel {
          background-color: transparent;
          border: 1px solid var(--border-zinc);
          color: var(--text-muted);
        }

        .btn-cancel:hover {
          color: var(--text-primary);
          border-color: var(--border-zinc-hover);
        }

        .paused-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background-color: var(--color-amber);
        }

        .timer-stats-footer {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
        }

        .stats-separator {
          width: 1px;
          height: 16px;
          background-color: var(--border-zinc);
        }

        .section-subtitle-small {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .admin-duty-form {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .select-member {
          flex: 1;
          min-width: 200px;
        }

        .input-note {
          flex: 2;
          min-width: 250px;
        }

        .section-title-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .badge-count {
          font-size: 0.8rem;
          color: var(--color-amber);
          background-color: var(--color-amber-glow);
          border: 1px solid rgba(251, 191, 36, 0.2);
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
          font-style: italic;
          background-color: rgba(24, 24, 27, 0.2);
        }

        .keko-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-avatar-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .table-avatar-img {
          height: 52px;
          margin-top: -10px;
          image-rendering: pixelated;
        }

        .duty-keko-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-xs {
          font-size: 0.75rem;
          padding: 6px 12px;
          font-weight: 600;
          border-radius: var(--radius-sm);
        }

        @media (min-width: 641px) {
          .mobile-cards-list {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .table-container {
            display: none;
          }
          .mobile-cards-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .member-mobile-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-zinc);
            border-radius: var(--radius-lg);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .admin-duty-form {
            flex-direction: column;
            align-items: stretch;
          }
          .admin-duty-form button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
