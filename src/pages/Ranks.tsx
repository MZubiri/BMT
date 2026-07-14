import React, { useState } from 'react';
import { Award, X } from 'lucide-react';
import { habboService } from '../services/habboService';

interface Rank {
  name: string;
  promotions: number | null;
  price: number;
}

interface Tier {
  id: string;
  name: string;
  badge: string;
  promotions: number;
  ranks: Rank[];
}

export const TIER_DATA: Tier[] = [
  {
    id: 'reclutas',
    name: 'Reclutas',
    badge: 'b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14',
    promotions: 8,
    ranks: [
      { name: 'Grumete', promotions: 8, price: 10 },
      { name: 'Guardiamarina', promotions: 8, price: 18 },
      { name: 'Recluta', promotions: 8, price: 26 },
      { name: 'Cadete 1er Año', promotions: 8, price: 34 },
      { name: 'Cadete 2do Año', promotions: 8, price: 42 },
      { name: 'Cadete 3er Año', promotions: 8, price: 50 },
      { name: 'Cadete 4to Año', promotions: 8, price: 58 },
      { name: 'Instr. de Entren.', promotions: 8, price: 66 }
    ]
  },
  {
    id: 'sub-oficiales',
    name: 'Sub-Oficiales',
    badge: 'b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622',
    promotions: 12,
    ranks: [
      { name: 'Cabo', promotions: 12, price: 102 },
      { name: 'Sargento', promotions: 12, price: 138 },
      { name: 'Sargento Primero', promotions: 12, price: 174 },
      { name: 'Sargento de Artillería', promotions: 12, price: 210 },
      { name: 'Sargento Mayor', promotions: 12, price: 246 },
      { name: 'Brigada', promotions: 12, price: 282 },
      { name: 'Subteniente', promotions: 12, price: 318 },
      { name: 'Subteniente Mayor', promotions: 12, price: 354 }
    ]
  },
  {
    id: 'oficiales',
    name: 'Oficiales',
    badge: 'b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7',
    promotions: 18,
    ranks: [
      { name: 'Segundo Teniente', promotions: 18, price: 444 },
      { name: 'Primer Teniente', promotions: 18, price: 534 },
      { name: 'Alférez', promotions: 18, price: 624 },
      { name: 'Alférez de Fragata', promotions: 18, price: 714 },
      { name: 'Alférez de Navío', promotions: 18, price: 804 },
      { name: 'Capitán', promotions: 18, price: 894 },
      { name: 'Teniente de Navío', promotions: 18, price: 984 },
      { name: 'Capitán de Corbeta', promotions: 18, price: 1074 }
    ]
  },
  {
    id: 'oficiales-superiores',
    name: 'Oficiales Superiores',
    badge: 'b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79',
    promotions: 22,
    ranks: [
      { name: 'Mayor', promotions: 22, price: 1252 },
      { name: 'Mayor Ejecutivo', promotions: 22, price: 1428 },
      { name: 'Teniente Coronel', promotions: 22, price: 1604 },
      { name: 'Capitán de Navío', promotions: 22, price: 1780 },
      { name: 'Coronel', promotions: 22, price: 1956 },
      { name: 'Comandante de División', promotions: 22, price: 2132 },
      { name: 'Director de Investigación', promotions: 22, price: 2308 },
      { name: 'Director de Recursos Humanos', promotions: 22, price: 2484 }
    ]
  },
  {
    id: 'generales',
    name: 'Generales',
    badge: 'b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642',
    promotions: 28,
    ranks: [
      { name: 'General de Brigada', promotions: 28, price: 2764 },
      { name: 'General de División', promotions: 28, price: 3044 },
      { name: 'Teniente General', promotions: 28, price: 3324 },
      { name: 'General de Ejército', promotions: 28, price: 3604 },
      { name: 'Capitán General', promotions: 28, price: 3884 },
      { name: 'Mayor General', promotions: 28, price: 4164 }
    ]
  },
  {
    id: 'estado-mayor',
    name: 'Estado Mayor',
    badge: 'b07244s01134s36047s44244t52114ef2302532c051c38ee561e6bf57d9d42',
    promotions: 0,
    ranks: [
      { name: 'Tesorero Ejecutivo', promotions: null, price: 5000 },
      { name: 'Secretario de Estado', promotions: null, price: 5500 },
      { name: 'Secretario Ejecutivo', promotions: null, price: 6000 },
      { name: 'Ministro de Defensa', promotions: null, price: 6500 },
      { name: 'Ministro de Justicia', promotions: null, price: 7000 }
    ]
  }
];

export const Ranks: React.FC = () => {
  const [selectedRank, setSelectedRank] = useState<{
    name: string;
    price: number;
    promotions: number | null;
    tierName: string;
    tierId: string;
  } | null>(null);

  const getRankDetails = (tierId: string) => {
    let pay = '';
    let time = '';
    let uniform = '';
    let privileges = '';

    if (tierId === 'reclutas') {
      pay = 'Paga de Recluta ($25 c.)';
      time = 'Tiempo de servicio básico';
      uniform = 'Uniforme militar estándar en color verde militar.';
      privileges = 'Miembro en entrenamiento. Debes obedecer órdenes del personal superior y aprender las consignas básicas de seguridad.';
    } else if (tierId === 'sub-oficiales') {
      pay = 'Paga de Suboficial ($50 c. semanal)';
      time = '5 horas de servicio';
      uniform = 'Uniforme de Suboficiales con boina negra estándar.';
      privileges = 'Autorización para supervisar el ingreso en las puertas del cuartel y coordinar relevos en los escritorios.';
    } else if (tierId === 'oficiales') {
      pay = 'Paga de Oficial ($78 c. semanal)';
      time = '5 horas de servicio';
      uniform = 'Uniforme formal de gala de Oficial con camisa blanca y corbata oscura.';
      privileges = 'Capacidad para abrir y cerrar el cuartel general, guiar entrenamientos a reclutas y dar órdenes directas a suboficiales.';
    } else if (tierId === 'oficiales-superiores') {
      pay = 'Paga de Oficial Superior ($110 c. semanal)';
      time = '5 horas de servicio';
      uniform = 'Uniforme de Oficial Superior con boina militar dorada u oficial.';
      privileges = 'Mando intermedio del batallón. Supervisión de entrenamientos, revisión de nóminas y recomendación de ascensos.';
    } else if (tierId === 'generales') {
      pay = 'Paga de General ($125 c. semanal)';
      time = 'Tiempo estratégico libre';
      uniform = 'Uniforme de gala de General con charreteras doradas e insignias especiales.';
      privileges = 'Alto mando militar. Poder de decisión táctica, organización de eventos oficiales y reclutamiento masivo.';
    } else {
      pay = 'Paga de Estado Mayor ($150 c. semanal)';
      time = 'Presencia de gestión y tesorería';
      uniform = 'Traje ejecutivo oscuro formal o uniforme de gala personalizado.';
      privileges = 'Fundación y dirección ejecutiva. Decisiones administrativas definitivas y manejo de las donaciones del batallón.';
    }

    return { pay, time, uniform, privileges };
  };

  return (
    <div className="container container-wide">
      <div className="ranks-header">
        <div className="section-title">
          <Award className="text-amber" size={32} />
          <h1>Rangos y Jerarquía</h1>
        </div>
        <p className="section-subtitle">
          Listado oficial de la jerarquía militar del <strong>Batallón Militar Táctico [BMT]</strong>. Haz clic en cualquier rango para ver sus detalles de uniforme, paga y privilegios en el cuartel.
        </p>
      </div>

      <div className="tiers-container">
        {TIER_DATA.map((tier) => (
          <section key={tier.id} className="tier-section">
            <div className="tier-header-card">
              <div className="tier-title-group">
                <img
                  src={habboService.getBadgeUrl(tier.badge)}
                  alt={`Placa de ${tier.name}`}
                  className="tier-badge-img"
                  loading="lazy"
                />
                <h2 className="tier-name">
                  <span className="text-amber">[»]</span> {tier.name}
                </h2>
              </div>
              <div className="tier-info-pill">
                Ascenso: {tier.promotions > 0 ? `${tier.promotions} asistencias` : '—'}
              </div>
            </div>

            <div className="ranks-grid">
              {tier.ranks.map((rank, index) => (
                <div 
                  key={index} 
                  className="rank-interactive-card"
                  onClick={() => setSelectedRank({
                    name: rank.name,
                    price: rank.price,
                    promotions: rank.promotions,
                    tierName: tier.name,
                    tierId: tier.id
                  })}
                >
                  <div className="rank-card-header">
                    <img 
                      src={habboService.getBadgeUrl(tier.badge)} 
                      alt="Badge" 
                      className="rank-card-badge"
                    />
                    <h3 className="rank-card-title">{rank.name}</h3>
                  </div>
                  <div className="rank-card-footer">
                    <span className="rank-card-promo-label">
                      {rank.promotions ? `${rank.promotions} asis.` : '—'}
                    </span>
                    <span className="rank-card-price-tag font-pixel">
                      ${rank.price} c.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Interactive Details Modal */}
      {selectedRank && (
        <div className="modal-backdrop" onClick={() => setSelectedRank(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedRank(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-header-section">
              <div className="modal-badge-container">
                <img 
                  src={habboService.getBadgeUrl(
                    TIER_DATA.find(t => t.id === selectedRank.tierId)?.badge || ''
                  )} 
                  alt="Badge" 
                  className="modal-badge-img"
                />
              </div>
              <div>
                <span className="modal-tier-tag font-pixel">{selectedRank.tierName}</span>
                <h2 className="modal-rank-title">{selectedRank.name}</h2>
              </div>
            </div>

            <div className="modal-body-section">
              <div className="modal-detail-item">
                <span className="modal-detail-label">Paga / Salario:</span>
                <p className="modal-detail-value text-gradient">{getRankDetails(selectedRank.tierId).pay}</p>
              </div>

              <div className="modal-detail-item">
                <span className="modal-detail-label">Requisito de Tiempo:</span>
                <p className="modal-detail-value">{getRankDetails(selectedRank.tierId).time}</p>
              </div>

              <div className="modal-detail-item">
                <span className="modal-detail-label">Uniforme Reglamentario:</span>
                <p className="modal-detail-value">{getRankDetails(selectedRank.tierId).uniform}</p>
              </div>

              <div className="modal-detail-item">
                <span className="modal-detail-label">Responsabilidades y Privilegios:</span>
                <p className="modal-detail-value description-text">{getRankDetails(selectedRank.tierId).privileges}</p>
              </div>

              <div className="modal-footer-stats">
                <div className="stat-box">
                  <span className="stat-num">{selectedRank.promotions || '—'}</span>
                  <span className="stat-desc">Asistencias para Ascenso</span>
                </div>
                <div className="stat-box gold-border">
                  <span className="stat-num text-amber">${selectedRank.price} c.</span>
                  <span className="stat-desc">Precio de Compra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ranks-header {
          margin-bottom: 48px;
        }

        .tiers-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .tier-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tier-header-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          gap: 16px;
          flex-wrap: wrap;
        }

        .tier-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tier-badge-img {
          width: 39px;
          height: 39px;
          image-rendering: pixelated;
        }

        .tier-name {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .tier-info-pill {
          background-color: var(--color-amber-glow);
          color: var(--color-amber);
          border: 1px solid rgba(251, 191, 36, 0.2);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* Ranks Card Grid Styles */
        .ranks-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .ranks-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .ranks-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .ranks-grid {
            grid-template-columns: 1fr;
          }
        }

        .rank-interactive-card {
          background-color: rgba(39, 39, 42, 0.3);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .rank-interactive-card:hover {
          background-color: rgba(251, 191, 36, 0.02);
          border-color: rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -10px rgba(251, 191, 36, 0.3);
        }

        .rank-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rank-card-badge {
          width: 32px;
          height: 32px;
          image-rendering: pixelated;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .rank-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .rank-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 10px;
        }

        .rank-card-promo-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .rank-card-price-tag {
          font-size: 0.8rem;
          color: var(--color-amber);
          font-weight: bold;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 24px;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc-hover);
          border-radius: var(--radius-lg);
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          animation: modalAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
          background-color: rgba(255, 255, 255, 0.05);
        }

        .modal-header-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-badge-container {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-badge-img {
          width: 46px;
          height: 46px;
          image-rendering: pixelated;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }

        .modal-tier-tag {
          font-size: 0.68rem;
          color: var(--color-amber);
          letter-spacing: 0.05em;
        }

        .modal-rank-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .modal-body-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-detail-label {
          font-size: 0.72rem;
          font-weight: bold;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .modal-detail-value {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .description-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          font-weight: 400;
        }

        .text-gradient {
          color: var(--color-amber);
          background: linear-gradient(135deg, var(--color-amber) 0%, #fcd34d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .modal-footer-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-box {
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-box.gold-border {
          border-color: rgba(251, 191, 36, 0.25);
          background-color: rgba(251, 191, 36, 0.01);
        }

        .stat-num {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .stat-desc {
          font-size: 0.72rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
