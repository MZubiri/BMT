import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CreditCard, MessageSquare, Shield, Trophy } from 'lucide-react';
import { habboService } from '../services/habboService';

const JERARQUIA = [
  { name: 'Invitados <BMT>', badge: 'b27134s02155s01133s03114t2711481f3eadf408fec9345f82da9624efa56' },
  { name: 'Alistados <BMT>', badge: 'b09024s02135s01023s03024s16164967cf3c5c7c85d0a42e0d1cd1cbb6139' },
  { name: 'Reclutas <BMT>', badge: 'b09134s02155s36047s44134t27114e862510ff77289cfa52c2552470f2105' },
  { name: 'Sub - Oficial <BMT>', badge: 'b09054s02135s36047s44054t27114cd31c00da2fd4753e88e344a7723ff14' },
  { name: 'Oficiales <BMT>', badge: 'b09024s02135s36047s44024t271148598db7ba6558ee51c564e76ef038622' },
  { name: 'Oficiales Superiores <BMT>', badge: 'b09104s02135s36047s44104t2711491934527c2d1d1e021e0a14fce6a11f7' },
  { name: 'Generales <BMT>', badge: 'b09044s02135s36047s44044t27114f40bb88ea9beaa9d10de4e9af2eaea79' },
  { name: 'Estado Mayor <BMT>', badge: 'b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642' }
];

const GRUPOS_ESPECIALES = [
  { name: 'Club VIP <BMT>', badge: 'b07244s01134s36047s44244t52114ef2302532c051c38ee561e6bf57d9d42' },
  { name: 'Instr. Capacitación <BMT>', badge: 'b09014s02135s01013s03014t5501425f94961d34c6b3efd805544136c48d2' },
  { name: 'Recursos Humanos RRHH <BMT>', badge: 'b09114s02155s01133s44114t09154d1ff5cf25cde2dcd6f51f55f9fed1799' },
  { name: '[✠] Despacho <BMT> [✠] © ™', badge: 'b09134s02245s36047s11014s19114ee81c2ae461ce911bf3278cbc18cab9d' },
  { name: '[✠] Despacho <BMT> [✠] © ™', badge: 'b11134s02014s01114s03094t27014b9662d7c9dc8322cd83b4ae619c04057' },
  { name: '[✠] Supreme <BMT> [✠] ™', badge: 'b11134s02015s01133s11134t270143d45a022402a8787aafb0f197ff01672' }
];

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-logo-wrapper">
          <img 
            src={habboService.getBadgeUrl('b07014s02135s36047s44014s38114a7f2417aeed5e4160f9bc26de9ecf642')}
            alt="BMT Logo"
            className="hero-logo-img"
          />
        </div>
        <p className="hero-tagline font-pixel">[✠] BATALLON MILITAR TACTICO [BMT] [✠] © ™</p>
        <h1 className="hero-title">
          La nueva era del <span className="text-gradient">Batallón Militar Táctico</span>
        </h1>
        <p className="hero-desc">
          Ejército virtual de Habbo Hotel en la sección Hispana. Paga segura 100 %, ascensos constantes y una comunidad que jamás se rinde. ¡BMT manda!
        </p>
        <div className="hero-actions">
          <Link to="/ranks" className="btn btn-primary btn-lg-premium">
            Ver rangos
          </Link>
          <Link to="/pay" className="btn btn-secondary btn-lg-premium">
            Horario de pagas
          </Link>
        </div>
      </section>

      {/* Alto Mando (Owners) Section */}
      <section className="alto-mando-section">
        <h2 className="section-heading">Alto mando</h2>
        <p className="section-subtitle">Los dueños y fundadores del batallón.</p>
        
        <div className="alto-mando-grid">
          <div className="owner-card">
            <div className="owner-avatar-wrapper">
              <img 
                src={habboService.getAvatarUrl('Migue-lito13.-', { action: 'std', gesture: 'sml' })} 
                alt="Migue-lito13.-" 
                className="owner-avatar-img"
              />
            </div>
            <h3 className="owner-name">Migue-lito13.-</h3>
            <div className="owner-role-pill">
              <Trophy size={12} className="text-amber" /> Dueño
            </div>
          </div>

          <div className="owner-card">
            <div className="owner-avatar-wrapper">
              <img 
                src={habboService.getAvatarUrl('-lYeremi-', { action: 'std', gesture: 'sml' })} 
                alt="-lYeremi-" 
                className="owner-avatar-img"
              />
            </div>
            <h3 className="owner-name">-lYeremi-</h3>
            <div className="owner-role-pill">
              <Trophy size={12} className="text-amber" /> Dueño
            </div>
          </div>
        </div>
      </section>

      {/* Placas Oficiales Section */}
      <section className="placas-section">
        <h2 className="section-heading">Placas oficiales</h2>
        <p className="section-subtitle">
          Las placas de los grupos del BMT en Habbo, ordenadas por jerarquía, renderizadas en directo por el servicio de imágenes de Habbo.
        </p>

        <div className="placas-group">
          <h3 className="placas-subheading font-pixel">JERARQUÍA</h3>
          <div className="badges-grid grid-4">
            {JERARQUIA.map((item, idx) => (
              <div key={idx} className="badge-item-card">
                <img 
                  src={habboService.getBadgeUrl(item.badge)} 
                  alt={item.name} 
                  className="badge-item-img"
                  loading="lazy"
                />
                <span className="badge-item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="placas-group">
          <h3 className="placas-subheading font-pixel">GRUPOS ESPECIALES Y DE MANDO</h3>
          <div className="badges-grid grid-3">
            {GRUPOS_ESPECIALES.map((item, idx) => (
              <div key={idx} className="badge-item-card">
                <img 
                  src={habboService.getBadgeUrl(item.badge)} 
                  alt={item.name} 
                  className="badge-item-img"
                  loading="lazy"
                />
                <span className="badge-item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explora el Cuartel Section */}
      <section className="explora-section">
        <h2 className="section-heading">Explora el cuartel</h2>
        <div className="explora-grid">
          <Link to="/ranks" className="explora-card card">
            <div className="explora-icon-wrapper">
              <Award className="explora-icon" />
            </div>
            <div className="explora-content">
              <h3>Rangos</h3>
              <p>Toda la jerarquía del BMT: de Recluta Inicial a Estado Mayor, con ascensos y precios.</p>
            </div>
          </Link>

          <Link to="/pay" className="explora-card card">
            <div className="explora-icon-wrapper">
              <CreditCard className="explora-icon" />
            </div>
            <div className="explora-content">
              <h3>Pagas</h3>
              <p>Horario de pagas del domingo por país y la paga que corresponde a cada rango.</p>
            </div>
          </Link>

          <Link to="/flood" className="explora-card card">
            <div className="explora-icon-wrapper">
              <MessageSquare className="explora-icon" />
            </div>
            <div className="explora-content">
              <h3>Flood</h3>
              <p>Cánticos oficiales de defensa y bienvenida listos para copiar y pegar en la sala.</p>
            </div>
          </Link>

          <Link to="/donations" className="explora-card card">
            <div className="explora-icon-wrapper">
              <Shield className="explora-icon" />
            </div>
            <div className="explora-content">
              <h3>Donaciones</h3>
              <p>Las únicas personas autorizadas para recibir donaciones del batallón.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* CSS specific for Home Page */}
      <style>{`
        .home-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 80px;
        }
        
        .hero-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 0 20px;
        }

        .hero-logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
        }

        .hero-logo-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          image-rendering: pixelated;
        }

        .hero-tagline {
          font-size: 0.72rem;
          color: var(--color-amber);
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 3.2rem;
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .text-gradient {
          color: var(--color-amber);
          background: linear-gradient(135deg, var(--color-amber) 0%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 650px;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-lg-premium {
          padding: 12px 28px;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .section-heading {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
          text-align: center;
          max-width: 600px;
          margin: 0 auto 36px;
          line-height: 1.5;
        }

        /* Alto Mando Styles */
        .alto-mando-grid {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .owner-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
          padding: 24px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 260px;
          transition: var(--transition-smooth);
        }

        .owner-card:hover {
          border-color: var(--border-zinc-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .owner-avatar-wrapper {
          width: 110px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 12px;
          position: relative;
        }

        .owner-avatar-img {
          transform: scale(1.35) translateY(10px);
          image-rendering: pixelated;
        }

        .owner-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .owner-role-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-amber);
          background-color: var(--color-amber-glow);
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(251, 191, 36, 0.2);
        }

        /* Placas Section Styles */
        .placas-group {
          margin-top: 40px;
        }

        .placas-subheading {
          font-size: 0.8rem;
          color: var(--color-amber);
          letter-spacing: 0.08em;
          margin-bottom: 20px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .badges-grid {
          display: grid;
          gap: 16px;
        }

        .grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        .grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 900px) {
          .grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
          .grid-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .grid-4, .grid-3 {
            grid-template-columns: 1fr;
          }
        }

        .badge-item-card {
          background-color: rgba(39, 39, 42, 0.3);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: var(--transition-smooth);
        }

        .badge-item-card:hover {
          background-color: rgba(251, 191, 36, 0.02);
          border-color: rgba(251, 191, 36, 0.2);
          transform: scale(1.02);
        }

        .badge-item-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          image-rendering: pixelated;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
        }

        .badge-item-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Explora Cuartel Styles */
        .explora-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .explora-grid {
            grid-template-columns: 1fr;
          }
        }

        .explora-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .explora-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-zinc-hover);
        }

        .explora-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background-color: var(--color-amber-glow);
          color: var(--color-amber);
          flex-shrink: 0;
        }

        .explora-icon {
          width: 24px;
          height: 24px;
        }

        .explora-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-primary);
        }

        .explora-content p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};
