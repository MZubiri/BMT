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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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
              <div key={item.id} className="copy-bubble-container">
                <div className="habbo-bubble font-habbo">
                  {item.text}
                </div>
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
              <div key={item.id} className="copy-bubble-container">
                <div className="habbo-bubble habbo-bubble-welcome font-habbo">
                  {item.text}
                </div>
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

        .font-habbo {
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .copy-btn.copied {
          border-color: var(--color-emerald);
          color: var(--color-emerald);
          background-color: var(--color-emerald-glow);
        }

        @media (max-width: 640px) {
          .flood-section {
            padding: 20px;
          }
          .copy-bubble-container {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .copy-btn {
            align-self: flex-end;
          }
          .habbo-bubble::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
