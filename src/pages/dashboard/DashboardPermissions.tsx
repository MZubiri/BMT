import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, Check } from 'lucide-react';

interface Permission {
  action_key: string;
  min_role: 'OWNER' | 'OFFICER' | 'MEMBER';
}

const ACTION_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  'edit_floods': {
    title: 'Modificar Floods',
    desc: 'Permite crear, editar y eliminar frases/comandos oficiales del batallón.'
  },
  'manage_registrations': {
    title: 'Aprobar Registros',
    desc: 'Permite aceptar o rechazar solicitudes de acceso a la oficina de nuevos kekos.'
  },
  'manage_members': {
    title: 'Gestión de Miembros',
    desc: 'Permite añadir personal, modificar rangos/cargos, resetear contraseñas y dar de baja miembros.'
  },
  'manage_duties': {
    title: 'Registrar Tiempos Ajenos',
    desc: 'Permite iniciar, pausar, terminar o cancelar el tiempo de servicio de otros militares.'
  },
  'manage_paybox': {
    title: 'Reiniciar Caja de Pagas',
    desc: 'Permite borrar las horas semanales acumuladas al finalizar el ciclo de pagos.'
  }
};

export const DashboardPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('bmt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchPermissions = () => {
    setIsLoading(true);
    fetch('/api/admin/permissions', { headers: getHeaders() })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar permisos');
        return res.json();
      })
      .then(data => setPermissions(data))
      .catch(err => setMessage({ text: err.message, type: 'error' }))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleUpdatePermission = (actionKey: string, minRole: 'OWNER' | 'OFFICER' | 'MEMBER') => {
    setUpdatingKey(actionKey);
    setMessage(null);

    fetch('/api/admin/permissions', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ actionKey, minRole })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar el permiso');
        setMessage({ text: `Permiso para "${ACTION_DESCRIPTIONS[actionKey]?.title || actionKey}" actualizado.`, type: 'success' });
        
        // Update local state
        setPermissions(prev => prev.map(p => p.action_key === actionKey ? { ...p, min_role: minRole } : p));
      })
      .catch(err => setMessage({ text: err.message, type: 'error' }))
      .finally(() => setUpdatingKey(null));
  };

  return (
    <div className="fade-in card">
      <div className="section-title-wrapper" style={{ marginBottom: '8px' }}>
        <h2 className="section-title">
          <ShieldCheck className="text-amber" size={24} />
          Gestión de Permisos de la Plataforma
        </h2>
      </div>
      <p className="form-description" style={{ marginBottom: '24px' }}>
        Configura el nivel de acceso administrativo mínimo requerido para realizar cada acción en la plataforma. Cambios aplicados en tiempo real.
      </p>

      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-info' : 'alert-danger'}`} style={{ marginBottom: '20px' }}>
          {message.type === 'success' && <Check size={16} className="text-emerald" />}
          <span>{message.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state" style={{ padding: '40px 0' }}>
          <Loader2 className="animate-spin text-amber" size={32} />
          <p>Cargando configuración de permisos...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Acción / Funcionalidad</th>
                <th>Descripción</th>
                <th style={{ width: '220px' }}>Rol Mínimo Requerido</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => {
                const info = ACTION_DESCRIPTIONS[p.action_key] || { title: p.action_key, desc: 'Sin descripción.' };
                const isUpdating = updatingKey === p.action_key;

                return (
                  <tr key={p.action_key}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {info.title}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {info.desc}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={p.min_role}
                          onChange={(e) => handleUpdatePermission(p.action_key, e.target.value as any)}
                          className="role-selector"
                          style={{ width: '100%', maxWidth: '200px' }}
                          disabled={isUpdating}
                        >
                          <option value="MEMBER">Militar (Cualquiera)</option>
                          <option value="OFFICER">Oficial (Administradores)</option>
                          <option value="OWNER">Dueño (Solo Propietarios)</option>
                        </select>
                        {isUpdating && <Loader2 className="animate-spin text-amber" size={16} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
