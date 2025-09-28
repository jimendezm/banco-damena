import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; 
import { FiUser } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { getUsers } from '../services/userService'; 
import '../styles/Layout.css';

function Layout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { idUsuario } = useParams();

  useEffect(() => {
    if (idUsuario) {
      // Buscar usuario por ID
      const usersData = getUsers();
      const user = usersData.users.find(u => u.id === parseInt(idUsuario));
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Usar datos demo si no encuentra el usuario
        const demoUser = usersData.users.find(u => u.username === 'demo');
        setCurrentUser(demoUser);
      }
    } else {
      // Si no hay ID en la URL, usar sessionStorage
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        const usersData = getUsers();
        const demoUser = usersData.users.find(u => u.username === 'demo');
        setCurrentUser(demoUser);
      }
    }
  }, [idUsuario, location]);

  const getCurrentSection = () => {
    const path = location.pathname;
    // Extraer la sección base (remover ID si existe)
    const section = path.split('/')[1];
    return section || 'dashboard';
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
    
    // Navegar con ID si está disponible
    if (currentUser && currentUser.id && currentUser.id !== 1) { // 1 es el ID del usuario demo
      navigate(`/${section}/${currentUser.id}`);
    } else {
      navigate(`/${section}`);
    }
  };

  const userDisplayName = currentUser?.nombre || '';

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
            <FiUser className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{userDisplayName}</span>
              <span className="user-role">
                {currentUser && currentUser.id !== 1 ? `` : 'Modo Demo'}
              </span>
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