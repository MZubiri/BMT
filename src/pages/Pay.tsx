import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface CountryTime {
  country: string;
  flag: string;
  time: string;
}

interface RankPay {
  rank: string;
  pay: number;
}

const SCHEDULE_DATA: CountryTime[] = [
  { country: 'México', flag: '🇲🇽', time: '4:00 p. m. (16:00)' },
  { country: 'Colombia', flag: '🇨🇴', time: '5:00 p. m. (17:00)' },
  { country: 'Venezuela', flag: '🇻🇪', time: '6:00 p. m. (18:00)' },
  { country: 'Chile', flag: '🇨🇱', time: '7:00 p. m. (19:00)' },
  { country: 'Argentina', flag: '🇦🇷', time: '7:00 p. m. (19:00)' },
  { country: 'España', flag: '🇪🇸', time: '7:00 p. m. (19:00)' }
];

const PAY_DATA: RankPay[] = [
  { rank: 'Alistados', pay: 7 },
  { rank: 'Reclutas', pay: 25 },
  { rank: 'Suboficiales', pay: 50 },
  { rank: 'Oficiales', pay: 78 },
  { rank: 'Oficiales superiores', pay: 110 },
  { rank: 'Generales', pay: 125 },
  { rank: 'Estado Mayor', pay: 150 }
];

export const Pay: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const nextSunday = new Date();
      
      // Calculate days until next Sunday (0 is Sunday, 1 is Monday, etc.)
      const currentDay = now.getDay();
      const daysUntilSunday = (7 - currentDay) % 7;
      
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      // Set to evening pay time, e.g., 18:00
      nextSunday.setHours(18, 0, 0, 0);

      // If Sunday and already past 18:00, set to next Sunday
      if (currentDay === 0 && now.getHours() >= 18) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }

      const diffMs = nextSunday.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffDays > 0) {
        setTimeLeft(`${diffDays}d ${diffHours}h ${diffMinutes}m`);
      } else {
        setTimeLeft(`${diffHours}h ${diffMinutes}m`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="pay-header">
        <div className="section-title">
          <Calendar className="text-amber" size={32} />
          <h1>Pagas y Horarios</h1>
        </div>
        <p className="section-subtitle">
          Paga segura al 100%. Nuestro <strong>único día de pagas</strong> es el <strong className="text-amber">domingo</strong>, según la hora local de cada país.
        </p>
      </div>

      {/* Countdown Card */}
      <div className="countdown-card card">
        <div className="countdown-info">
          <Clock className="text-amber countdown-icon" size={24} />
          <div>
            <h3 className="countdown-title">Próxima sesión de pagas</h3>
            <p className="countdown-subtitle">Los domingos a partir de las 16:00 - 19:00 local.</p>
          </div>
        </div>
        <div className="countdown-timer font-pixel">
          {timeLeft || 'Cargando...'}
        </div>
      </div>

      <div className="grid-2">
        {/* Schedule Section */}
        <section className="pay-section">
          <h2 className="table-heading-with-icon">
            <Clock className="text-amber" size={20} />
            Horario del Domingo
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>País</th>
                  <th style={{ textAlign: 'right' }}>Hora Local</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_DATA.map((item, index) => (
                  <tr key={index}>
                    <td className="country-cell">
                      <span className="flag-icon" aria-hidden="true">
                        {item.flag}
                      </span>
                      {item.country}
                    </td>
                    <td className="time-cell" style={{ textAlign: 'right' }}>
                      {item.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Rates Section */}
        <section className="pay-section">
          <h2 className="table-heading-with-icon">
            <DollarSign className="text-amber" size={20} />
            Pagas por Rango
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Rango</th>
                  <th style={{ textAlign: 'right' }}>Monto de Paga</th>
                </tr>
              </thead>
              <tbody>
                {PAY_DATA.map((item, index) => (
                  <tr key={index}>
                    <td className="rank-cell">{item.rank}</td>
                    <td className="table-price" style={{ textAlign: 'right' }}>
                      ${item.pay} c.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {styleHtml}
    </div>
  );
};

const styleHtml = (
  <style>{`
    .pay-header {
      margin-bottom: 32px;
    }

    .countdown-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
      border-left: 4px solid var(--color-amber);
      background-color: var(--bg-card);
      flex-wrap: wrap;
      gap: 16px;
    }

    .countdown-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .countdown-icon {
      animation: pulse-slow 3s infinite;
    }

    .countdown-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .countdown-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .countdown-timer {
      font-size: 1.1rem;
      color: var(--color-amber);
      background-color: var(--color-amber-glow);
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .table-heading-with-icon {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 16px;
    }

    .country-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-primary);
      font-weight: 600;
    }

    .flag-icon {
      font-size: 1.2rem;
    }

    .time-cell {
      font-weight: 700;
      color: var(--color-amber);
    }

    .rank-cell {
      color: var(--text-primary);
      font-weight: 600;
    }

    @keyframes pulse-slow {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }

    @media (max-width: 640px) {
      .countdown-card {
        flex-direction: column;
        align-items: flex-start;
      }
      .countdown-timer {
        align-self: flex-start;
      }
    }
  `}</style>
);
