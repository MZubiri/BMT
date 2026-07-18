import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

// Pages
import { Home } from './pages/Home';
import { Ranks } from './pages/Ranks';
import { Pay } from './pages/Pay';
import { Flood } from './pages/Flood';
import { Donations } from './pages/Donations';
import { Access } from './pages/Access';

// Dashboard Pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { DashboardUsers } from './pages/dashboard/DashboardUsers';
import { DashboardPay } from './pages/dashboard/DashboardPay';
import { DashboardPermissions } from './pages/dashboard/DashboardPermissions';
import { DashboardProfile } from './pages/dashboard/DashboardProfile';

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <Link to="/" className="logo" onClick={closeMobileMenu}>
              <Shield className="logo-icon" size={24} />
              <span className="font-pixel logo-text-short">BMT</span>
              <span className="logo-text-long">Batallón Militar Táctico</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-links">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Inicio
              </NavLink>
              <NavLink to="/ranks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Rangos
              </NavLink>
              <NavLink to="/pay" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Pagas
              </NavLink>
              <NavLink to="/flood" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Flood
              </NavLink>
              <NavLink to="/donations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Donaciones
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-highlight' : 'active-highlight'}`}>
                Oficina
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="mobile-menu-btn" aria-label="Toggle navigation menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Navigation Drawer */}
            <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
              <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>
                Inicio
              </NavLink>
              <NavLink to="/ranks" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Rangos
              </NavLink>
              <NavLink to="/pay" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Pagas
              </NavLink>
              <NavLink to="/flood" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Flood
              </NavLink>
              <NavLink to="/donations" onClick={closeMobileMenu} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                Donaciones
              </NavLink>
              <NavLink to="/dashboard" onClick={closeMobileMenu} className="mobile-nav-link active-highlight">
                Oficina
              </NavLink>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranks" element={<Ranks />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/flood" element={<Flood />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/access" element={<Access />} />
            
            {/* Private Dashboard Section */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<DashboardUsers />} />
              <Route path="pay" element={<DashboardPay />} />
              <Route path="permissions" element={<DashboardPermissions />} />
              <Route path="profile" element={<DashboardProfile />} />
            </Route>
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-logo">
              <Shield size={18} />
              <span className="font-pixel">[»] BATALLÓN MILITAR TÁCTICO [BMT] [»] ® ™</span>
            </div>
            <p className="footer-text">
              La nueva era del Batallón Militar Táctico · Fundado en 2025 · Habbo Hotel (sección Hispana)
            </p>
            <p className="footer-subtext">
              Dueños: Migue-lito13.- y -lYeremi- · Las placas y avatares se renderizan con el servicio de imágenes oficial de Habbo.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
