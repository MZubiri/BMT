import React, { useState } from 'react';
import { MessagesSquare, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface FloodItem {
  id: string;
  text: string;
}

const DEFENSE_FLOODS: FloodItem[] = [
  {
    id: 'def-1',
    text: '★ TÚ NOS VIENES A ATACAR, PUES ELEGISTE LA PEOR OPCIÓN. ★ ⚡ B.M.T ⚡ TE DOMINA. ⚡ B.M.T ⚡ RÍNDETE ANTE NOSOTROS. ★'
  },
  {
    id: 'def-2',
    text: '⊘ SØMØS ⚡ B.M.T ⚡ T3 GØB3RNAMOS. ⊘ SØMØS LA NUEVA ERA. ⚡ B.M.T ⚡ NØSØTROS NO OS TEMEMOS. ⊘'
  }
];

const WELCOME_FLOODS: FloodItem[] = [
  {
    id: 'wel-1',
    text: '♣ ¡Bienvenidos a BMT™! [★] Paga diaria de $7 por 1 hora y 30 minutos, más ascenso a Recluta. ¡Ven y te doy empleo! ♥'
  },
  {
    id: 'wel-2',
    text: '★ MI VIDA ERA GRIS, PERO GRACIAS A [BMT] PUDE COMPRAR COLORES. [BMT] PAGA SEMANAL. ¡ÚNETE! ♧♧♧♧'
  }
];

export const Flood: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setActiveBubble(id);
      
      // Reset copied state
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);

      // Hide the floating bubble after animation finishes
      setTimeout(() => {
        setActiveBubble(null);
      }, 1200);
    });
  };

  return (
    <div className="container">
      <div className="flood-header">
        <div className="section-title">
          <MessagesSquare className="text-amber" size={32} />
          <h1>Flood del Batallón</h1>
        </div>
        <p className="section-subtitle">
          Copia las frases oficiales para coordinar las bienvenidas de nuevos reclutas o la defensa ante ataques en las salas del batallón.
        </p>
      </div>

      <div className="flood-grid">
        {/* Defense Floods */}
        <section className="flood-section card">
          <h2 className="section-subheading text-red">
            <ShieldAlert size={20} />
            Floods de Ataque / Defensa
          </h2>
          <p className="section-desc">Usa estas frases cuando la sala esté bajo ataque para neutralizar al enemigo:</p>
          <div className="bubble-list">
            {DEFENSE_FLOODS.map((item) => (
              <div key={item.id} className="copy-bubble-row">
                <div className="habbo-bubble habbo-bubble-white font-habbo">
                  {item.text}
                </div>
                <div className="btn-relative-container">
                  {activeBubble === item.id && (
                    <div className="floating-copied-bubble font-pixel">
                      ¡Copiado! o/
                    </div>
                  )}
                  <button
                    onClick={() => handleCopy(item.text, item.id)}
                    className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                    title="Copiar al portapapeles"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={14} className="text-emerald" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Welcome Floods */}
        <section className="flood-section card">
          <h2 className="section-subheading text-emerald">
            <Sparkles size={20} />
            Floods de Bienvenida / Publicidad
          </h2>
          <p className="section-desc">Usa estas frases para invitar a nuevos usuarios y reclutas a unirse a las filas:</p>
          <div className="bubble-list">
            {WELCOME_FLOODS.map((item) => (
              <div key={item.id} className="copy-bubble-row">
                <div className="habbo-bubble habbo-bubble-yellow font-habbo">
                  {item.text}
                </div>
                <div className="btn-relative-container">
                  {activeBubble === item.id && (
                    <div className="floating-copied-bubble font-pixel">
                      ¡Copiado! o/
                    </div>
                  )}
                  <button
                    onClick={() => handleCopy(item.text, item.id)}
                    className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                    title="Copiar al portapapeles"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={14} className="text-emerald" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .flood-header {
          margin-bottom: 40px;
        }

        .flood-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .flood-section {
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          padding: 32px;
        }

        .section-subheading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .section-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .bubble-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .copy-bubble-row {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: space-between;
        }

        /* Habbo dialog bubble style */
        .habbo-bubble {
          position: relative;
          border: 2px solid #18181b;
          border-radius: 6px;
          padding: 10px 16px;
          color: #000000;
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.9);
          flex-grow: 1;
        }

        .habbo-bubble::before {
          content: '';
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px 0 5px 10px;
          border-style: solid;
          border-color: transparent transparent transparent #18181b;
        }

        .habbo-bubble-white {
          background-color: #ffffff;
        }

        .habbo-bubble-white::after {
          content: '';
          position: absolute;
          right: -7px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 4px 0 4px 8px;
          border-style: solid;
          border-color: transparent transparent transparent #ffffff;
        }

        .habbo-bubble-yellow {
          background-color: #fffbbf; /* Classic Habbo yellow talk bubble */
        }

        .habbo-bubble-yellow::after {
          content: '';
          position: absolute;
          right: -7px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 4px 0 4px 8px;
          border-style: solid;
          border-color: transparent transparent transparent #fffbbf;
        }

        .font-habbo {
          font-size: 0.88rem;
          font-weight: 600;
          font-family: monospace, system-ui;
        }

        /* Floating bubble container */
        .btn-relative-container {
          position: relative;
          flex-shrink: 0;
        }

        /* Floating copied bubble animation */
        @keyframes floatUpFade {
          0% {
            opacity: 0;
            transform: translate(-50%, 0);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -12px);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -18px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -32px);
          }
        }

        .floating-copied-bubble {
          position: absolute;
          left: 50%;
          bottom: 100%;
          background-color: #4ade80; /* Nice bright green */
          color: #000000;
          border: 2px solid #18181b;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.9);
          animation: floatUpFade 1.2s cubic-bezier(0.25, 1, 0.50, 1) forwards;
          z-index: 10;
          pointer-events: none;
        }

        .floating-copied-bubble::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -6px;
          transform: translateX(-50%);
          border-width: 6px 6px 0;
          border-style: solid;
          border-color: #18181b transparent;
        }

        .floating-copied-bubble::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -4px;
          transform: translateX(-50%);
          border-width: 4px 4px 0;
          border-style: solid;
          border-color: #4ade80 transparent;
        }

        .copy-btn {
          min-width: 100px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .copy-btn.copied {
          border-color: var(--color-emerald);
          color: var(--color-emerald);
          background-color: var(--color-emerald-glow);
        }

        @media (max-width: 768px) {
          .copy-bubble-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .habbo-bubble::before, .habbo-bubble::after {
            display: none;
          }
          .copy-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
