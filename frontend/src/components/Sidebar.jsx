import { 
  FiPieChart, 
  FiCreditCard, 
  FiDollarSign, 
  FiRepeat,
  FiFileText,
  FiTrendingUp,
  FiShield,
  FiUser,
  FiHelpCircle,
  FiLogOut,
  FiHome,
  FiX
} from 'react-icons/fi';
import '../styles/Sidebar.css';

function Sidebar({ currentSection, onSectionChange, isOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiPieChart /> },
    { id: 'cuentas', label: 'Mis Cuentas', icon: <FiHome /> },
    { id: 'tarjetas', label: 'Tarjetas', icon: <FiCreditCard /> },
    { id: 'transferencias', label: 'Transferencias', icon: <FiRepeat /> },
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
  };

  const handleCerrarSesion = () => {
      sessionStorage.removeItem('currentUser');
      window.location.href = '/';
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiHome className="logo-icon" />
            <div>
              <h2 className="sidebar-title">Banco Damena</h2>
              <p className="sidebar-subtitle">Banca en Línea</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => onSectionChange('toggle')}>
            <FiX />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-item">
                <button
                  className={`sidebar-link ${currentSection === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="security-badge">
            <FiShield className="security-icon" />
            <span>Sitio Seguro</span>
          </div>
          
          {/* Botón de Cerrar Sesión separado */}
          <button 
            className="logout-button"
            onClick={handleCerrarSesion}
          >
            <FiLogOut className="logout-icon" />
            <span>Cerrar Sesión</span>
          </button>
          
          <p className="sidebar-version">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;