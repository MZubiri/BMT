import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { Clock, Users, DollarSign, LogOut, MessageSquare, ShieldCheck } from 'lucide-react';
import { habboService } from '../../services/habboService';

export interface UserSession {
  name: string;
  role: 'OWNER' | 'OFFICER' | 'MEMBER';
  figure: string;
  loginTime: string;
}

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bmt_session');
    if (!savedSession) {
      navigate('/access');
      return;
    }
    setSession(JSON.parse(savedSession));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('bmt_session');
    navigate('/access');
  };

  if (!session) return null;

  const lowercasePath = location.pathname.toLowerCase();
  const isTimeTab = lowercasePath === '/dashboard' || lowercasePath === '/dashboard/';
  const isUsersTab = lowercasePath.includes('/dashboard/users');
  const isPayTab = lowercasePath.includes('/dashboard/pay');

  const showAdminMenu = session.role === 'OWNER' || session.role === 'OFFICER';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar-wrapper">
            <img
              src={habboService.getAvatarUrl(session.name, { size: 'm' })}
              alt={session.name}
              className="sidebar-avatar"
            />
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{session.name}</div>
            <span className={`badge-pill badge-${session.role.toLowerCase()}`}>
              {session.role === 'OWNER' ? 'Dueño' : session.role === 'OFFICER' ? 'Oficial' : 'Militar'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`sidebar-link ${isTimeTab ? 'active' : ''}`}>
            <Clock size={18} />
            <span>Mi Tiempo</span>
          </Link>
          
          {showAdminMenu && (
            <>
              <Link to="/dashboard/users" className={`sidebar-link ${isUsersTab ? 'active' : ''}`}>
                <Users size={18} />
                <span>Miembros</span>
              </Link>
              <Link to="/dashboard/pay" className={`sidebar-link ${isPayTab ? 'active' : ''}`}>
                <DollarSign size={18} />
                <span>Caja de Pagas</span>
              </Link>
              <Link to="/flood" className="sidebar-link">
                <MessageSquare size={18} />
                <span>Floods</span>
              </Link>
              {session.role === 'OWNER' && (
                <Link to="/dashboard/permissions" className={`sidebar-link ${location.pathname === '/dashboard/permissions' ? 'active' : ''}`}>
                  <ShieldCheck size={18} />
                  <span>Permisos</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Pane Content */}
      <main className="dashboard-pane">
        <Outlet />
      </main>

      <style>{`
        .sidebar-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          margin-bottom: 24px;
        }

        .sidebar-avatar-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          background-color: var(--bg-darker);
          border: 1px solid var(--border-zinc);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-avatar {
          height: 64px;
          margin-top: -10px;
          image-rendering: pixelated;
        }

        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .sidebar-username {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: 1px solid var(--border-zinc);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
          margin-top: auto;
          text-align: left;
          width: 100%;
        }

        .sidebar-logout-btn:hover {
          color: var(--color-red);
          border-color: rgba(239, 68, 68, 0.3);
          background-color: rgba(239, 68, 68, 0.05);
        }

        @media (max-width: 768px) {
          .sidebar-user-card {
            margin-bottom: 0;
            padding: 8px 12px;
          }
          .sidebar-logout-btn {
            margin-top: 0;
            width: auto;
          }
          .sidebar-nav {
            flex-direction: row;
            flex: unset;
          }
        }
      `}</style>
    </div>
  );
};
