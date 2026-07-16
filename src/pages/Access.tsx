import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, UserPlus, LogIn } from 'lucide-react';

export const Access: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const trimmedUsername = username.trim();

    // Dev Bypass
    if (mode === 'login' && trimmedUsername.toLowerCase() === 'guss' && password === 'guss') {
      const session = {
        name: 'Guss',
        role: 'OWNER' as const,
        figure: 'hr-115-42.hd-195-2.ch-3030-82.lg-275-1408.sh-300-64',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('bmt_token', 'mock-developer-jwt-token');
      localStorage.setItem('bmt_session', JSON.stringify(session));

      const savedMembersRaw = localStorage.getItem('bmt_members');
      let membersList = savedMembersRaw ? JSON.parse(savedMembersRaw) : [];
      const exists = membersList.some((m: any) => m.name.toLowerCase() === 'guss');
      
      if (!exists) {
        membersList.push({
          id: 999,
          name: 'Guss',
          role: 'OWNER',
          figure: session.figure,
          joinedAt: new Date().toISOString(),
          weekMinutes: 0,
          totalMinutes: 0,
          rankName: 'Ministro de Defensa'
        });
        localStorage.setItem('bmt_members', JSON.stringify(membersList));
      }

      navigate('/dashboard');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor');
      }

      if (mode === 'login') {
        localStorage.setItem('bmt_token', data.token);
        localStorage.setItem('bmt_session', JSON.stringify(data.session));
        navigate('/dashboard');
      } else {
        setSuccessMessage(data.message || 'Registro completado. Tu cuenta está pendiente de aprobación por un administrador.');
        setUsername('');
        setPassword('');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="access-card card">
        <div className="access-icon-header">
          <KeyRound className="text-amber" size={36} />
          <h2>Oficina BMT</h2>
        </div>

        {/* Tab Selection */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMessage(null);
            }}
            disabled={isLoading}
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
              setSuccessMessage(null);
            }}
            disabled={isLoading}
          >
            <UserPlus size={16} />
            <span>Registrarse</span>
          </button>
        </div>

        <p className="access-instructions">
          {mode === 'login' 
            ? 'Ingresa tus credenciales registradas para acceder a tu hoja de servicio y al panel de control militar.'
            : 'Crea tu cuenta de oficina vinculada a tu keko. Una vez registrado, un administrador o dueño deberá aprobar tu ingreso.'
          }
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de tu keko en Habbo.es
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Ej.: Migue-lito13.-"
              autoComplete="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Escribe tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Procesando...
              </>
            ) : (
              mode === 'login' ? 'Entrar a la Oficina' : 'Completar Registro'
            )}
          </button>
        </form>
      </div>

      <style>{`
        .access-card {
          max-width: 460px;
          margin: 40px auto;
          padding: 40px;
          border-top: 4px solid var(--color-amber);
        }

        .access-icon-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .access-icon-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
        }

        .auth-tabs {
          display: flex;
          background-color: rgba(24, 24, 27, 0.4);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 4px;
          margin-bottom: 24px;
        }

        .auth-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .auth-tab-btn:hover:not(:disabled) {
          color: var(--text-primary);
          background-color: rgba(39, 39, 42, 0.4);
        }

        .auth-tab-btn.active {
          background-color: var(--color-amber);
          color: #000;
        }

        .access-instructions {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          text-align: center;
          margin-bottom: 28px;
        }

        .w-full {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .access-card {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};
