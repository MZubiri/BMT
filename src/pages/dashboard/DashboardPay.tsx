import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Copy, Check, Calendar, TrendingUp } from 'lucide-react';
import { habboService } from '../../services/habboService';

interface Member {
  id: number;
  name: string;
  role: string;
  figure: string;
  joinedAt: string;
  weekMinutes: number;
  totalMinutes: number;
  rankName?: string; // e.g. "Recluta", "Sargento Primero"
}

// Function to calculate pay rate based on the rank
export const getPayRate = (rankName: string = 'Grumete'): number => {
  const name = rankName.toLowerCase().trim();
  
  // 1. Alistados
  if (name.includes('alistado')) return 7;
  
  // 2. Estado Mayor
  if (name.includes('tesorero') || name.includes('secretario') || name.includes('ministro')) {
    return 150;
  }
  
  // 3. Generales
  if (name.includes('general') || name.includes('gral') || name.includes('ejército')) {
    return 125;
  }
  
  // 4. Oficiales Superiores
  if (name.includes('mayor') || name.includes('cmdt') || name.includes('coronel') || name.includes('comandante') || name.includes('director') || name.includes('rrhh') || name.includes('rr.hh') || name.includes('investigación')) {
    if (name.includes('coronel oficial')) {
      return 78; // Oficiales tier
    }
    return 110;
  }
  
  // 5. Oficiales
  if (name.includes('teniente') || name.includes('alférez') || name.includes('capitán') || name.includes('navío') || name.includes('corbeta')) {
    if (name.includes('subteniente')) {
      return 50; // Suboficiales tier
    }
    return 78;
  }
  
  // 6. Suboficiales (Sub-Oficiales)
  if (name.includes('cabo') || name.includes('sargento') || name.includes('brigada') || name.includes('sgto') || name.includes('suboficial')) {
    return 50;
  }
  
  // 7. Reclutas (default)
  return 25;
};

export const DashboardPay: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [copied, setCopied] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('bmt_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const refreshMembers = () => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  // Reset all weekly minutes to 0
  const handleResetWeeklyMinutes = () => {
    if (window.confirm('¿Estás seguro de reiniciar los minutos semanales a 0? Haz esto únicamente después de pagar las nóminas del domingo. Esta acción no se puede deshacer.')) {
      fetch('/api/pay/reset', {
        method: 'POST',
        headers: getHeaders()
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al reiniciar las nóminas');
          alert('Minutos semanales reiniciados con éxito.');
          refreshMembers();
        })
        .catch(err => alert(err.message));
    }
  };

  // Convert minutes into pay based on the rate.
  // Formula: (weekMinutes / 60) * payRate. Rounded to nearest credit.
  const calculatePay = (mins: number, rankName: string = 'Grumete'): number => {
    if (mins <= 0) return 0;
    const hours = mins / 60;
    const rate = getPayRate(rankName);
    // Let's assume the rate is the hourly payment rate (or the full payout rate if they complete a 1-hour shift).
    // If they serve 1 hour, they get 100% of the rank pay.
    return Math.max(0, Math.round(hours * rate));
  };

  // Export payroll report text to clipboard
  const handleExportReport = () => {
    const payables = members.filter(m => m.weekMinutes > 0);
    if (payables.length === 0) {
      alert('No hay nóminas registradas esta semana.');
      return;
    }

    let report = `*📋 REPORTE DE PAGAS BMT - DOMINGO ${new Date().toLocaleDateString()}*\n`;
    report += `=====================================\n`;
    
    payables.forEach(m => {
      const hrs = Math.floor(m.weekMinutes / 60);
      const mins = m.weekMinutes % 60;
      const payout = calculatePay(m.weekMinutes, m.rankName);
      report += `• *${m.name}* (${m.rankName || 'Grumete'}) - ${hrs}h ${mins}m -> *${payout} créditos*\n`;
    });

    report += `=====================================\n`;
    const totalPayroll = payables.reduce((acc, m) => acc + calculatePay(m.weekMinutes, m.rankName), 0);
    report += `*Total Nómina:* ${totalPayroll} créditos a pagar.`;

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Summaries
  const totalMins = members.reduce((acc, m) => acc + m.weekMinutes, 0);
  const totalHours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  
  const totalPayroll = members.reduce((acc, m) => acc + calculatePay(m.weekMinutes, m.rankName), 0);
  const payableMembersCount = members.filter(m => m.weekMinutes > 0).length;

  const formatMinutes = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pay-dashboard-header">
        <div className="section-title">
          <DollarSign className="text-amber" size={24} />
          <h1>Caja y Nóminas de Pagas</h1>
        </div>
        <p className="section-subtitle">
          Cálculo en tiempo real de los créditos acumulados por cada militar esta semana. Las pagas se liquidan los domingos.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid-3">
        <div className="card summary-card">
          <TrendingUp className="summary-icon text-emerald" size={20} />
          <div className="summary-title">Total Horas Servidas</div>
          <div className="summary-value">{totalHours}h {remainingMins}m</div>
        </div>
        <div className="card summary-card">
          <DollarSign className="summary-icon text-amber" size={20} />
          <div className="summary-title">Nómina Total Estimada</div>
          <div className="summary-value text-amber">${totalPayroll} c.</div>
        </div>
        <div className="card summary-card">
          <Calendar className="summary-icon text-secondary" size={20} />
          <div className="summary-title">Militares a Pagar</div>
          <div className="summary-value">{payableMembersCount}</div>
        </div>
      </div>

      {/* Action panel */}
      <div className="payroll-actions card">
        <button onClick={handleExportReport} className="btn btn-primary">
          {copied ? (
            <>
              <Check size={16} /> ¡Copiado al portapapeles!
            </>
          ) : (
            <>
              <Copy size={16} /> Exportar Reporte para Copiar
            </>
          )}
        </button>
        <button onClick={handleResetWeeklyMinutes} className="btn btn-secondary text-red-hover">
          <RefreshCw size={16} /> Reiniciar Semana de Trabajo
        </button>
      </div>

      {/* Payroll Table */}
      <section>
        <h2 className="section-subheading">Nómina Detallada</h2>
        <div className="table-container">
          {members.length === 0 ? (
            <div className="empty-state">No hay miembros registrados en el batallón.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Militar</th>
                  <th>Rango Militar</th>
                  <th>Tarifa Horaria</th>
                  <th>Tiempo Servido</th>
                  <th style={{ textAlign: 'right' }}>Paga Acumulada</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const payout = calculatePay(member.weekMinutes, member.rankName);
                  const isPayable = member.weekMinutes > 0;
                  
                  return (
                    <tr key={member.id} className={isPayable ? 'row-payable' : ''}>
                      <td className="keko-cell">
                        <div className="table-avatar-wrapper">
                          <img
                            src={habboService.getAvatarUrl(member.name, { size: 'm' })}
                            alt={member.name}
                            className="table-avatar-img"
                          />
                        </div>
                        <span className="duty-keko-name">{member.name}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img 
                            src={habboService.getBadgeUrl(habboService.getBadgeForRank(member.rankName || 'Grumete'))} 
                            alt="Placa" 
                            className="rank-badge-inline"
                          />
                          <span>{member.rankName || 'Grumete'}</span>
                        </div>
                      </td>
                      <td>${getPayRate(member.rankName)} c. / hora</td>
                      <td className="font-semibold text-zinc-300">
                        {formatMinutes(member.weekMinutes)}
                      </td>
                      <td className="table-price" style={{ textAlign: 'right', fontSize: '1rem' }}>
                        ${payout} c.
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {payout > 0 ? (
                          <span className="payout-badge payout-ready">Listo para pagar</span>
                        ) : (
                          <span className="payout-badge payout-empty">Sin servicio</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <style>{`
        .summary-card {
          position: relative;
          padding: 24px;
          border-top: 3px solid var(--border-zinc);
        }

        .summary-card:nth-child(2) {
          border-top-color: var(--color-amber);
        }

        .summary-icon {
          position: absolute;
          right: 24px;
          top: 24px;
        }

        .summary-title {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
          margin-bottom: 8px;
        }

        .summary-value {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .payroll-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding: 16px 24px;
        }

        .text-red-hover:hover {
          color: var(--color-red) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        .row-payable {
          background-color: rgba(16, 185, 129, 0.02) !important;
        }

        .row-payable:hover {
          background-color: rgba(16, 185, 129, 0.04) !important;
        }

        .payout-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .payout-ready {
          background-color: var(--color-emerald-glow);
          color: var(--color-emerald);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .payout-empty {
          background-color: rgba(39, 39, 42, 0.2);
          color: var(--text-muted);
          border: 1px solid rgba(39, 39, 42, 0.4);
        }

        @media (max-width: 480px) {
          .payroll-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};
