import React from 'react';
import { Coins, AlertTriangle } from 'lucide-react';
import { habboService } from '../services/habboService';

interface DonorOfficer {
  name: string;
  role: string;
}

const OFFICERS: DonorOfficer[] = [
  { name: 'Migue-lito13.-', role: 'Encargado oficial' },
  { name: '-lYeremi-', role: 'Encargado oficial' },
  { name: '...alma@.', role: 'Encargado oficial' },
  { name: 'Ashleeyy', role: 'Encargado oficial' }
];

export const Donations: React.FC = () => {
  return (
    <div className="container">
      <div className="donations-header">
        <div className="section-title">
          <Coins className="text-amber" size={32} />
          <h1>Donaciones</h1>
        </div>
        <p className="section-subtitle">
          Las donaciones para el sostenimiento del batallón <strong>solo</strong> deben ser entregadas a los dueños y encargados oficiales autorizados listados a continuación:
        </p>
      </div>

      {/* Officers Grid */}
      <div className="grid-3">
        {OFFICERS.map((officer, index) => (
          <div key={index} className="officer-card card">
            <div className="avatar-wrapper">
              <img
                src={habboService.getAvatarUrl(officer.name, { size: 'l', direction: 2, headDirection: 3, action: 'std', gesture: 'sml' })}
                alt={`Avatar de ${officer.name}`}
                className="avatar-img"
                loading="lazy"
              />
            </div>
            <div className="officer-info">
              <h3 className="officer-name">{officer.name}</h3>
              <p className="officer-role">{officer.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Box */}
      <div className="alert alert-danger donations-alert">
        <AlertTriangle size={24} className="text-red shrink-0" />
        <div>
          <strong>¡IMPORTANTE!</strong>
          <p>No nos hacemos responsables por créditos, raros o donaciones entregadas a cualquier miembro, militar u oficial que no figure en la lista anterior. Asegúrate de verificar el nombre exacto de la persona antes de realizar cualquier donación.</p>
        </div>
      </div>

      <style>{`
        .donations-header {
          margin-bottom: 40px;
        }

        .officer-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px;
          text-align: center;
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          transition: var(--transition-smooth);
        }

        .officer-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-zinc-hover);
          box-shadow: 0 12px 24px -12px rgba(251, 191, 36, 0.2);
        }

        .avatar-wrapper {
          width: 140px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar-img {
          height: 190px;
          image-rendering: pixelated;
        }

        .officer-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .officer-role {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-amber);
        }

        .donations-alert {
          margin-top: 48px;
          border-left: 4px solid var(--color-red);
          align-items: flex-start;
        }

        .donations-alert strong {
          color: #ef4444;
          font-size: 0.95rem;
          display: block;
          margin-bottom: 4px;
        }

        .donations-alert p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .shrink-0 {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
