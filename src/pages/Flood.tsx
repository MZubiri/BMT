import React, { useState, useEffect } from 'react';
import { MessagesSquare, Copy, Check, ShieldAlert, Sparkles, Edit2, Trash2, Plus, X, Loader2 } from 'lucide-react';

interface FloodItem {
  id: number;
  category: 'defense' | 'welcome';
  content: string;
}

export const Flood: React.FC = () => {
  const [floods, setFloods] = useState<FloodItem[]>([]);
  const [session, setSession] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeBubble, setActiveBubble] = useState<number | null>(null);
  
  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFlood, setEditingFlood] = useState<FloodItem | null>(null);
  const [formCategory, setFormCategory] = useState<'defense' | 'welcome'>('defense');
  const [formContent, setFormContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('bmt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchFloods = () => {
    fetch('/api/floods')
      .then(res => res.json())
      .then(data => setFloods(data))
      .catch(err => console.error('Error fetching floods:', err));
  };

  useEffect(() => {
    const savedSession = localStorage.getItem('bmt_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    fetchFloods();
  }, []);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setActiveBubble(id);
      
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);

      setTimeout(() => {
        setActiveBubble(null);
      }, 1200);
    });
  };

  const handleOpenAdd = (category: 'defense' | 'welcome') => {
    setEditingFlood(null);
    setFormCategory(category);
    setFormContent('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (flood: FloodItem) => {
    setEditingFlood(flood);
    setFormCategory(flood.category);
    setFormContent(flood.content);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este flood?')) return;

    fetch(`/api/floods/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar flood');
        fetchFloods();
      })
      .catch(err => alert(err.message));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;

    setIsSaving(true);
    try {
      const url = editingFlood ? `/api/floods/${editingFlood.id}` : '/api/floods';
      const method = editingFlood ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ category: formCategory, content: formContent.trim() })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el flood');
      }

      setIsEditorOpen(false);
      fetchFloods();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const showAdminControls = session?.role === 'OWNER';

  const defenseFloods = floods.filter(f => f.category === 'defense');
  const welcomeFloods = floods.filter(f => f.category === 'welcome');

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
          <div className="section-header-row">
            <h2 className="section-subheading text-red">
              <ShieldAlert size={20} />
              Floods de Ataque / Defensa
            </h2>
            {showAdminControls && (
              <button 
                type="button" 
                onClick={() => handleOpenAdd('defense')} 
                className="btn btn-red btn-xs"
              >
                <Plus size={14} /> Añadir
              </button>
            )}
          </div>
          <p className="section-desc">Usa estas frases cuando la sala esté bajo ataque para neutralizar al enemigo:</p>
          <div className="bubble-list">
            {defenseFloods.map((item) => (
              <div key={item.id} className="copy-bubble-row">
                <div className="habbo-bubble habbo-bubble-white font-habbo">
                  {item.content}
                </div>
                <div className="btn-relative-container">
                  {activeBubble === item.id && (
                    <div className="floating-copied-bubble font-pixel">
                      ¡Copiado! o/
                    </div>
                  )}
                  <div className="action-buttons-group">
                    <button
                      onClick={() => handleCopy(item.content, item.id)}
                      className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                      title="Copiar al portapapeles"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      <span>{copiedId === item.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    {showAdminControls && (
                      <>
                        <button 
                          onClick={() => handleOpenEdit(item)} 
                          className="copy-btn edit-action-btn"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="copy-btn delete-action-btn"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Welcome Floods */}
        <section className="flood-section card">
          <div className="section-header-row">
            <h2 className="section-subheading text-emerald">
              <Sparkles size={20} />
              Floods de Bienvenida / Publicidad
            </h2>
            {showAdminControls && (
              <button 
                type="button" 
                onClick={() => handleOpenAdd('welcome')} 
                className="btn btn-emerald btn-xs"
              >
                <Plus size={14} /> Añadir
              </button>
            )}
          </div>
          <p className="section-desc">Usa estas frases para invitar a nuevos usuarios y reclutas a unirse a las filas:</p>
          <div className="bubble-list">
            {welcomeFloods.map((item) => (
              <div key={item.id} className="copy-bubble-row">
                <div className="habbo-bubble habbo-bubble-yellow font-habbo">
                  {item.content}
                </div>
                <div className="btn-relative-container">
                  {activeBubble === item.id && (
                    <div className="floating-copied-bubble font-pixel">
                      ¡Copiado! o/
                    </div>
                  )}
                  <div className="action-buttons-group">
                    <button
                      onClick={() => handleCopy(item.content, item.id)}
                      className={`copy-btn ${copiedId === item.id ? 'copied' : ''}`}
                      title="Copiar al portapapeles"
                    >
                      {copiedId === item.id ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      <span>{copiedId === item.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    {showAdminControls && (
                      <>
                        <button 
                          onClick={() => handleOpenEdit(item)} 
                          className="copy-btn edit-action-btn"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="copy-btn delete-action-btn"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <div className="modal-header">
              <h3 className="font-pixel">{editingFlood ? 'EDITAR FLOOD' : 'NUEVO FLOOD'}</h3>
              <button onClick={() => setIsEditorOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select 
                  className="form-input" 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                >
                  <option value="defense">Ataque / Defensa</option>
                  <option value="welcome">Bienvenida / Publicidad</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contenido del Flood</label>
                <textarea 
                  className="form-input textarea-field" 
                  rows={4}
                  required
                  placeholder="Escribe el flood aquí..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setIsEditorOpen(false)} 
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Flood'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .flood-header {
          margin-bottom: 40px;
        }

        .flood-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .flood-section {
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
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
