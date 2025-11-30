import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Principal',
      path: '/dashboard',
      icon: HomeIcon
    },
    {
      title: 'Cuentas',
      path: '/dashboard/cuentas',
      icon: CreditCardIcon
    },
    {
      title: 'Tarjetas',
      path: '/dashboard/tarjetas',
      icon: CardIcon
    },
    {
      title: 'Transferencias',
      path: '/dashboard/transferencias',
      icon: TransferIcon
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('identificacion');
    window.location.href = '/';
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <BankIcon />
            </div>
            <div className="brand-text">
              <h1>Damena</h1>
              <p>Banca Digital</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.path} className="sidebar-item">
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={() => window.innerWidth <= 1024 && onClose()}
                  >
                    <span className="link-icon">
                      <item.icon />
                    </span>
                    <span className="link-text">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer del Sidebar */}
        <div className="sidebar-footer">
          <div className="footer-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <LogoutIcon />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// SVG Icons
const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7L4 8.5V21H6V19H18V21H20V8.5L22 7L12 2Z M12 4L18 7.5V9H6V7.5L12 4Z M8 11H10V17H8V11Z M14 11H16V17H14V11Z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"/>
  </svg>
);

const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V6H20V18Z"/>
  </svg>
);

const TransferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 10V12H16L10.5 17.5L11.92 18.92L19.84 11L11.92 3.08L10.5 4.5L16 10H4Z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export default Sidebar;