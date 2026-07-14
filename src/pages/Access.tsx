import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Copy, Check, ChevronLeft, ArrowRight } from 'lucide-react';
import { habboService } from '../services/habboService';
import type { HabboUser } from '../services/habboService';

export const Access: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'username' | 'verify'>('username');
  const [habboUser, setHabboUser] = useState<HabboUser | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate a code like BMT-XXXX
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BMT-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);

    const trimmedName = username.trim();
    if (trimmedName.toLowerCase() === 'guss') {
      const mockGussUser: HabboUser = {
        uniqueId: 'mock-guss-id',
        name: 'Guss',
        figureString: 'hr-115-42.hd-195-2.ch-3030-82.lg-275-1408.sh-300-64',
        motto: 'Bypass de desarrollo',
        online: false,
        profileVisible: true
      };
      setHabboUser(mockGussUser);
      setVerificationCode('DEV-GUSS');
      setStep('verify');
      setIsLoading(false);
      return;
    }

    try {
      const user = await habboService.getUserByUsername(username);
      setHabboUser(user);
      setVerificationCode(generateCode());
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con Habbo.es');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!habboUser) return;

    setIsLoading(true);
    setError(null);

    if (habboUser.name.toLowerCase() === 'guss') {
      const session = {
        name: 'Guss',
        role: 'OWNER' as const,
        figure: habboUser.figureString,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('bmt_token', 'mock-developer-jwt-token');
      localStorage.setItem('bmt_session', JSON.stringify(session));
      
      // Also ensure Guss is added to local members list for offline testing
      const savedMembersRaw = localStorage.getItem('bmt_members');
      let membersList = savedMembersRaw ? JSON.parse(savedMembersRaw) : [];
      const exists = membersList.some((m: any) => m.name.toLowerCase() === 'guss');
      
      if (!exists) {
        membersList.push({
          id: 999,
          name: 'Guss',
          role: 'OWNER',
          figure: habboUser.figureString,
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
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: habboUser.name, verificationCode })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error de autenticación');
      }

      const data = await response.json();
      localStorage.setItem('bmt_token', data.token);
      localStorage.setItem('bmt_session', JSON.stringify(data.session));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al validar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="container">
      <div className="access-card card">
        {step === 'username' ? (
          /* Step 1: Username Input */
          <form onSubmit={handleUsernameSubmit}>
            <div className="access-icon-header">
              <KeyRound className="text-amber" size={40} />
              <h2>Acceso Oficina</h2>
            </div>
            
            <p className="access-instructions">
              Inicia sesión en la oficina del BMT demostrando que el keko es tuyo: te damos un código, lo pones en la <strong>misión</strong> de tu keko en Habbo y lo comprobamos. Sin contraseñas.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

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

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading || !username.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Buscando keko...
                </>
              ) : (
                <>
                  Continuar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Verification Code */
          <div className="verify-flow">
            <button type="button" onClick={() => setStep('username')} className="back-btn" disabled={isLoading}>
              <ChevronLeft size={16} /> Cambiar keko
            </button>

            <div className="verify-user-header">
              <div className="avatar-circle">
                <img
                  src={habboService.getAvatarUrl(habboUser!.name, { size: 'm' })}
                  alt={habboUser!.name}
                  className="access-avatar-img"
                />
              </div>
              <h3 className="verify-user-name">{habboUser!.name}</h3>
            </div>

            <p className="verify-instructions">
              Pon este código en tu **misión** de Habbo y haz clic en verificar.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="code-box">
              <span className="code-text font-pixel">{verificationCode}</span>
              <button type="button" onClick={handleCopyCode} className="code-copy-btn">
                {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              </button>
            </div>

            <div className="verify-actions">
              <button
                type="button"
                onClick={handleVerifyCode}
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Comprobando...
                  </>
                ) : (
                  'Verificar y Entrar'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .access-card {
          max-width: 480px;
          margin: 40px auto;
          padding: 40px;
          border-top: 4px solid var(--color-amber);
        }

        .access-icon-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .access-icon-header h2 {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .access-instructions {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .w-full {
          width: 100%;
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 24px;
          padding: 0;
          transition: var(--transition-smooth);
        }

        .back-btn:hover {
          color: var(--text-primary);
        }

        .verify-user-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 9999px;
          background-color: var(--bg-card-hover);
          border: 1px solid var(--border-zinc);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .access-avatar-img {
          height: 100px;
          margin-top: -15px;
          image-rendering: pixelated;
        }

        .verify-user-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .verify-instructions {
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 20px;
        }

        .code-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-input);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 12px 20px;
          margin-bottom: 24px;
        }

        .code-text {
          font-size: 1.1rem;
          color: var(--color-amber);
          letter-spacing: 0.05em;
        }

        .code-copy-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .code-copy-btn:hover {
          background-color: var(--bg-card-hover);
          color: var(--text-primary);
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

        @media (max-width: 480px) {
          .access-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};
