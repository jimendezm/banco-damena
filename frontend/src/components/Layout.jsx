// components/UnifiedLayout.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';
import '../styles/Layout.css';
import { ValidateTime } from '../scripts/ValidateTime';

import PaginaPrincipal from '../pages/PaginaPrincipal';
import Cuentas from '../pages/Cuentas';
import Tarjetas from '../pages/Tarjetas';
import Transferencias from '../pages/Transferencias';

function UnifiedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('pagina-principal');
  const location = useLocation();
  const navigate = useNavigate();

  // Validación de autenticación
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginTime = localStorage.getItem("loginTime");
    const identificacion = localStorage.getItem("identificacion");
    
    if (!localToken || !userId || !loginTime || !identificacion) {
        navigate("/");
        return;
    }

    if (!ValidateTime()) {
        navigate("/");
        return;
    }

    const interval = setInterval(() => {
        if (!ValidateTime()) {
            navigate("/");
        }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'pagina-principal':
        return <PaginaPrincipal />;
      case 'cuentas':
        return <Cuentas />;
      case 'tarjetas':
        return <Tarjetas />;
      case 'transferencias':
        return <Transferencias />;
      default:
        return <PaginaPrincipal />;
    }
  };

  const userDisplayName = localStorage.getItem("userName") || "Usuario";

  return (
    <div className="layout-container">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <main className={`layout-main ${sidebarOpen ? 'layout-main-expanded' : ''}`}>
        <header className="layout-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <FiMenu className="menu-icon" />
            </button>
            <div className="header-info">
              <h2>{getSectionTitle(currentSection)}</h2>
              <p>{getSectionSubtitle(currentSection)}</p>
            </div>
          </div>
          <div className="header-user">
            <FiUser className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{userDisplayName}</span>
              <span className="user-role">Modo Demo</span>
            </div>
          </div>
        </header>
        
        <div className="layout-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function getSectionTitle(section) {
  const titles = {
    'pagina-principal': 'Página Principal',
    'cuentas': 'Mis Cuentas',
    'tarjetas': 'Tarjetas de Crédito',
    'transferencias': 'Transferencias'
  };
  return titles[section] || 'Mi Banco';
}

function getSectionSubtitle(section) {
  const subtitles = {
    'pagina-principal': 'Resumen general de tu actividad bancaria',
    'cuentas': 'Gestiona tus cuentas bancarias',
    'tarjetas': 'Administra tus tarjetas de crédito',
    'transferencias': 'Realiza transferencias entre cuentas'
  };
  return subtitles[section] || 'Banca en línea segura';
}

export default UnifiedLayout;