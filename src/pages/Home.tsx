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
        {/* Active duty pulsing status badge */}
        <div className="status-badge-container">
          <span className="status-dot"></span>
          <span className="status-text font-pixel">CUARTEL ACTIVO · EN SERVICIO</span>
        </div>

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
        <p className="section-subtitle">Los dueños y fundadores del batallón. Haz clic en sus tarjetas para ver sus perfiles en Habbo.</p>
        
        <div className="alto-mando-grid">
          <a 
            href="https://www.habbo.es/profile/Migue-lito13.-" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="owner-card"
            style={{ textDecoration: 'none' }}
          >
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
          </a>

          <a 
            href="https://www.habbo.es/profile/-lYeremi-" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="owner-card"
            style={{ textDecoration: 'none' }}
          >
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
          </a>
        </div>

        {/* Estado Mayor Sub-Section */}
        <div className="estado-mayor-container" style={{ marginTop: '48px' }}>
          <h3 className="section-subheading-central font-pixel text-gradient" style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '24px', letterSpacing: '0.05em' }}>
            [✠] ESTADO MAYOR [✠]
          </h3>
          <div className="estado-mayor-grid">
            <a 
              href="https://www.habbo.es/profile/Ashleeeeyy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="officer-card-small"
              style={{ textDecoration: 'none' }}
            >
              <div className="officer-avatar-wrapper-small">
                <img 
                  src={habboService.getAvatarUrl('Ashleeeeyy', { action: 'std', gesture: 'sml' })} 
                  alt="Ashleeeeyy" 
                  className="officer-avatar-img-small"
                />
              </div>
              <h4 className="officer-name-small">Ashleeeeyy</h4>
              <p className="officer-role-small font-pixel">Secretario de Estado</p>
            </a>

            <a 
              href="https://www.habbo.es/profile/...alma@." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="officer-card-small"
              style={{ textDecoration: 'none' }}
            >
              <div className="officer-avatar-wrapper-small">
                <img 
                  src={habboService.getAvatarUrl('...alma@.', { action: 'std', gesture: 'sml' })} 
                  alt="...alma@." 
                  className="officer-avatar-img-small"
                />
              </div>
              <h4 className="officer-name-small">...alma@.</h4>
              <p className="officer-role-small font-pixel">Secretario Ejecutivo</p>
            </a>

            <a 
              href="https://www.habbo.es/profile/QIR" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="officer-card-small"
              style={{ textDecoration: 'none' }}
            >
              <div className="officer-avatar-wrapper-small">
                <img 
                  src={habboService.getAvatarUrl('QIR', { action: 'std', gesture: 'sml' })} 
                  alt="QIR" 
                  className="officer-avatar-img-small"
                />
              </div>
              <h4 className="officer-name-small">QIR</h4>
              <p className="officer-role-small font-pixel">Tesorero Ejecutivo</p>
            </a>
          </div>
        </div>
      </section>

      {/* Cuartel General Room Section */}
      <section className="cuartel-section">
        <h2 className="section-heading">Cuartel general</h2>
        <p className="section-subtitle">Nuestras instalaciones principales dentro del hotel. Visítanos en vivo para comenzar tu entrenamiento.</p>
        
        <div className="cuartel-card card">
          <div className="cuartel-image-wrapper">
            <img 
              src="/habbo_bmt_hq.png" 
              alt="Cuartel General BMT" 
              className="cuartel-img"
            />
            <div className="cuartel-overlay">
              <span className="font-pixel overlay-tag">[✠] BMT HQ [✠]</span>
            </div>
          </div>
          <div className="cuartel-info">
            <h3 className="font-pixel text-gradient">¡ÚNETE A LAS FILAS!</h3>
            <p>
              Nuestra base táctica militar está equipada con sistemas avanzados de seguridad, zonas de reclutamiento y despachos de Estado Mayor. Aquí organizamos las guardias semanales, relevos y sesiones de pago seguras de cada domingo.
            </p>
            <p className="text-secondary font-pixel text-small">
              📍 Propietario de la sala: Migue-lito13.-
            </p>
            <a 
              href="https://www.habbo.es/hotel?room=147100" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg-premium btn-cuartel-go"
            >
              Entrar al Cuartel General ➔
            </a>
          </div>
        </div>
      </section>

      {/* Club BMT Section */}
      <section className="club-section">
        <h2 className="section-heading">Club <span className="text-gradient">[BMT]</span></h2>
        <p className="section-subtitle">El club VIP exclusivo para oficiales y soldados destacados. Adquiere tu membresía y obtén beneficios únicos en el cuartel.</p>
        
        <div className="club-container card">
          <div className="club-info-card">
            <div className="club-badge-icon">
              <Trophy className="text-amber" size={32} />
            </div>
            <div className="club-details">
              <h3 className="font-pixel">BENEFICIOS DE MEMBRESÍA</h3>
              <ul className="club-benefits-list">
                <li>
                  <span className="bullet-gold">✦</span> 
                  <strong>Uniforme Personalizado:</strong> Diseña y utiliza tu propio uniforme dentro de la base (con aprobación previa).
                </li>
                <li>
                  <span className="bullet-gold">✦</span> 
                  <strong>Guarda Paga de 24 Horas:</strong> Si no puedes retirar tu paga de nómina el domingo, la guardamos por 24 horas.
                </li>
                <li>
                  <span className="bullet-gold">✦</span> 
                  <strong>Colores Normales de Chat:</strong> Permiso para utilizar colores y estilos normales de burbujas en el chat de la sala.
                </li>
              </ul>
            </div>
          </div>
          <div className="club-price-card">
            <div className="price-tag font-pixel">35c</div>
            <p className="price-desc font-pixel">POR MES</p>
            <div className="divider"></div>
            <p className="price-instructions">
              Para adquirir la membresía, comunícate en vivo en el cuartel con los dueños del batallón autorizados.
            </p>
            <Link to="/donations" className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center', marginTop: '12px', padding: '8px 16px', fontSize: '0.8rem' }}>
              Ver encargados autorizados
            </Link>
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
          position: relative;
          
          /* Tactical monitor scanlines background effect */
          background-image: 
            radial-gradient(circle at 50% 10%, rgba(251, 191, 36, 0.04) 0%, transparent 60%),
            linear-gradient(rgba(18, 18, 18, 0) 97%, rgba(255, 255, 255, 0.007) 97%);
          background-size: 100% 100%, 100% 4px;
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

        /* Pulsing active status dot */
        .status-badge-container {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.25);
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 24px;
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.05);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulseGlow 1.8s infinite;
        }

        .status-text {
          font-size: 0.72rem;
          color: #4ade80;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 8px #4ade80;
          }
          50% {
            opacity: 0.3;
            box-shadow: 0 0 2px #4ade80;
          }
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
          box-shadow: 0 8px 30px rgba(251, 191, 36, 0.15);
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

        /* Cuartel General Room Section Styles */
        .cuartel-card {
          display: flex;
          gap: 32px;
          padding: 32px;
          align-items: center;
          background: linear-gradient(135deg, rgba(24, 24, 27, 0.6) 0%, rgba(39, 39, 42, 0.3) 100%);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-lg);
        }

        @media (max-width: 820px) {
          .cuartel-card {
            flex-direction: column;
            padding: 24px;
            gap: 24px;
          }
        }

        .cuartel-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid #18181b;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          flex-shrink: 0;
        }

        .cuartel-img {
          width: 100%;
          display: block;
          transition: transform 0.4s ease;
        }

        .cuartel-image-wrapper:hover .cuartel-img {
          transform: scale(1.04);
        }

        .cuartel-overlay {
          position: absolute;
          top: 14px;
          left: 14px;
          background-color: rgba(0, 0, 0, 0.85);
          border: 1px solid var(--color-amber);
          padding: 4px 10px;
          border-radius: 4px;
        }

        .overlay-tag {
          font-size: 0.68rem;
          color: var(--color-amber);
          font-weight: bold;
        }

        .cuartel-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex-grow: 1;
        }

        .cuartel-info h3 {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .cuartel-info p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .text-small {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .btn-cuartel-go {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        @media (max-width: 820px) {
          .btn-cuartel-go {
            width: 100%;
            justify-content: center;
          }
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

        /* Estado Mayor Styles */
        .estado-mayor-grid {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .officer-card-small {
          background-color: rgba(39, 39, 42, 0.4);
          border: 1px solid var(--border-zinc);
          border-radius: var(--radius-md);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 210px;
          transition: var(--transition-smooth);
        }

        .officer-card-small:hover {
          border-color: rgba(251, 191, 36, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.08);
        }

        .officer-avatar-wrapper-small {
          width: 80px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 8px;
          position: relative;
        }

        .officer-avatar-img-small {
          transform: scale(1.3) translateY(8px);
          image-rendering: pixelated;
        }

        .officer-name-small {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .officer-role-small {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-amber);
          letter-spacing: 0.02em;
        }

        /* Club BMT Styles */
        .club-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          border: 1px solid rgba(251, 191, 36, 0.15);
          background: linear-gradient(135deg, rgba(39, 39, 42, 0.3) 0%, rgba(24, 24, 27, 0.5) 100%);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(251, 191, 36, 0.03);
        }

        @media (max-width: 768px) {
          .club-container {
            grid-template-columns: 1fr;
          }
        }

        .club-info-card {
          padding: 40px;
          display: flex;
          gap: 24px;
        }

        @media (max-width: 600px) {
          .club-info-card {
            flex-direction: column;
            padding: 24px;
            gap: 16px;
          }
        }

        .club-badge-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background-color: var(--color-amber-glow);
          border-radius: var(--radius-md);
          border: 1px solid rgba(251, 191, 36, 0.2);
          flex-shrink: 0;
        }

        .club-details h3 {
          font-size: 0.95rem;
          color: var(--color-amber);
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }

        .club-benefits-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .club-benefits-list li {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .bullet-gold {
          color: var(--color-amber);
          margin-right: 8px;
          font-weight: bold;
        }

        .club-price-card {
          padding: 40px;
          background-color: rgba(24, 24, 27, 0.8);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        @media (max-width: 768px) {
          .club-price-card {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding: 32px;
          }
        }

        .club-price-card .price-tag {
          font-size: 3rem;
          font-weight: 900;
          color: var(--color-amber);
          line-height: 1;
        }

        .club-price-card .price-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 4px;
          letter-spacing: 0.1em;
        }

        .club-price-card .divider {
          width: 60px;
          height: 1px;
          background-color: var(--border-zinc);
          margin: 16px 0;
        }

        .club-price-card .price-instructions {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
