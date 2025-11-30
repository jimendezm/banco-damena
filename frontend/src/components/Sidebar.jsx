import { useState } from "react";
import '../styles/Sidebar.css';
import AlertConfirm from './AlertConfirm.jsx';

function Sidebar({ currentSection, onSectionChange, isOpen, onToggle }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { 
      id: 'pagina-principal', 
      label: 'Página Principal', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
    { 
      id: 'cuentas', 
      label: 'Mis Cuentas', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
    { 
      id: 'tarjetas', 
      label: 'Tarjetas', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
    { 
      id: 'transferencias', 
      label: 'Transferencias', 
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5l-5 5m0 0h10M7 10l5 5m0 0h10M12 15l5-5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    },
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
    if (window.innerWidth <= 1024) {
      onToggle();
    }
  };

  const handleCerrarSesion = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("identificacion");
    window.location.href = '/';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Header con gradiente */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <div className="logo-shape">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#25CB86"/>
                  <path d="M2 17l10 5 10-5" fill="#20B175"/>
                  <path d="M2 12l10 5 10-5" fill="#198A5B"/>
                </svg>
              </div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Damena</h1>
              <p className="brand-subtitle">Digital Banking</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onToggle} aria-label="Cerrar menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Navegación Principal</h3>
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.id} className="sidebar-item">
                  <button
                    className={`sidebar-link ${currentSection === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-text">{item.label}</span>
                    <span className="link-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer con acciones */}
        <div className="sidebar-footer">
          <div className="security-status">
            <div className="security-indicator">
              <div className="status-dot"></div>
              <span>Sesión Segura</span>
            </div>
            <div className="security-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#25CB86"/>
              </svg>
            </div>
          </div>

          <div className="footer-actions">
            <button className="support-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Soporte</span>
            </button>
            
            <button 
              className="logout-btn"
              onClick={handleCerrarSesion}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <AlertConfirm
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Sí, Cerrar Sesión"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
}

export default Sidebar;