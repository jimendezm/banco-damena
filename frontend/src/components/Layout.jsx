import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Cerrar sidebar al cambiar de ruta en móviles
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="layout-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <main className={`layout-main ${sidebarOpen ? 'layout-main-expanded' : ''}`}>
        <header className="layout-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
            >
              <span className="menu-icon">☰</span>
            </button>
            <div className="header-info">
              <h2>Banco Damena</h2>
              <p>Cuidamos lo tuyo</p>
            </div>
          </div>
          
          <div className="header-user">
            <span className="user-avatar">
              <UserIcon />
            </span>
            <div className="user-info">
              <span className="user-name">Usuario</span>
              <span className="user-role">Cliente</span>
            </div>
          </div>
        </header>

        <div className="layout-content">
          {children}
        </div>
      </main>
    </div>
  );
}

// SVG Icon para Usuario
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
  </svg>
);

export default Layout;