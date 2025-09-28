import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {FiUser} from 'react-icons/fi';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.replace('/', '');
  };

  const currentSection = getCurrentSection();

  const handleSectionChange = (section) => {
    if (section === 'cerrar-sesion') {
      if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        sessionStorage.removeItem('currentUser');
        navigate('/login');
      }
      return;
    }
    navigate(`/${section}`);
  };

  const userDisplayName = currentUser?.nombre || 'Usuario Demo';

  return (
    <div className="layout-container">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        isOpen={true}
      />
      
      <main className="layout-main">
        <header className="layout-header">
          <div className="header-info">
            <h2>{getSectionTitle(currentSection)}</h2>
            <p>{getSectionSubtitle(currentSection)}</p>
          </div>
          <div className="header-user">
            <FiUser className="user-avatar" ></FiUser>
            <div className="user-info">
              <span className="user-name">{userDisplayName}</span>
              <span className="user-role">{currentUser ? '' : 'Modo Demo'}</span>
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

// Función helper para títulos de sección
function getSectionTitle(section) {
  const titles = {
    'dashboard': 'Dashboard',
    'cuentas': 'Mis Cuentas',
    'tarjetas': 'Tarjetas de Crédito',
    'transferencias': 'Transferencias',
    'pagos': 'Pagos y Servicios',
    'prestamos': 'Préstamos',
    'seguros': 'Seguros',
    'perfil': 'Mi Perfil',
    'ayuda': 'Ayuda y Soporte'
  };
  return titles[section] || 'Mi Banco';
}

function getSectionSubtitle(section) {
  const subtitles = {
    'dashboard': 'Resumen general de tu actividad bancaria',
    'cuentas': 'Gestiona tus cuentas bancarias',
    'tarjetas': 'Administra tus tarjetas de crédito',
    'transferencias': 'Realiza transferencias entre cuentas',
    'pagos': 'Paga servicios y facturas',
    'prestamos': 'Solicita y gestiona préstamos',
    'seguros': 'Contrata y administra seguros',
    'perfil': 'Gestiona tu información personal',
    'ayuda': 'Encuentra ayuda y soporte técnico'
  };
  return subtitles[section] || 'Banca en línea segura';
}

export default Layout;