import React from 'react';
import { Award } from 'lucide-react';
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
    badge: 'b09134s02155s36047s44134t27114e862510ff77289cfa52c2552470f2105',
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
    badge: 'b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14',
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
    badge: 'b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622',
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
    badge: 'b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7',
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
    badge: 'b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79',
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
    badge: 'b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642',
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
  return (
    <div className="container container-wide">
      <div className="ranks-header">
        <div className="section-title">
          <Award className="text-amber" size={32} />
          <h1>Rangos y Precios</h1>
        </div>
        <p className="section-subtitle">
          Listado oficial de la jerarquía militar del <strong>Batallón Militar Táctico [BMT]</strong>. Los precios están expresados en créditos de Habbo Hotel.
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

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rango</th>
                    <th>Ascenso Necesario</th>
                    <th style={{ textAlign: 'right' }}>Precio de Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {tier.ranks.map((rank, index) => (
                    <tr key={index}>
                      <td className="rank-name">{rank.name}</td>
                      <td className="rank-promo">
                        {rank.promotions ? `${rank.promotions} asistencias` : '—'}
                      </td>
                      <td className="table-price">${rank.price} c.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

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
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: var(--color-amber);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .rank-name {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.95rem;
        }

        .rank-promo {
          color: var(--text-secondary);
        }

        @media (max-width: 640px) {
          .tier-header-card {
            padding: 16px;
          }
          .tier-name {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};
