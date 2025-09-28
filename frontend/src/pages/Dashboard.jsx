import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // ← Agregar useParams
import { 
  FiDollarSign, 
  FiHome, 
  FiCreditCard, 
  FiActivity,
  FiArrowRight,
  FiInfo,
  FiTarget,
  FiZap,
  FiTool,
  FiRepeat
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { getUsers } from '../services/userService';
import '../styles/Dashboard.css';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { idUsuario } = useParams();

  // Obtener el usuario basado en el ID de la URL
  useEffect(() => {
    if (idUsuario) {
      // Buscar usuario por ID en localStorage
      const usersData = getUsers();
      const user = usersData.users.find(u => u.id === parseInt(idUsuario));
      
      if (user) {
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Si no encuentra el usuario, usar datos demo
        const demoUser = usersData.users.find(u => u.username === 'demo');
        setCurrentUser(demoUser || getDemoUser());
      }
    } else {
      // Si no hay ID en la URL, usar sessionStorage o datos demo
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        const usersData = getUsers();
        const demoUser = usersData.users.find(u => u.username === 'demo');
        setCurrentUser(demoUser || getDemoUser());
      }
    }
  }, [idUsuario]);

  // Función para datos demo
  const getDemoUser = () => ({
    id: 0,
    nombre: "Usuario Demo",
    username: "demo",
    correo: "demo@banco.com",
    fechaRegistro: new Date().toISOString(),
    cuentas: [
      { 
        account_id: "CR01-0123-0456-000000000001",
        alias: "Cuenta Principal",
        tipo: "Ahorro",
        moneda: "CRC",
        saldo: 1523400.50
      },
      { 
        account_id: "CR01-0123-0456-000000000002",
        alias: "Cuenta de Ahorros",
        tipo: "Ahorro",
        moneda: "CRC", 
        saldo: 500000.00
      }
    ],
    tarjetas: [
      { 
        tipo: "Gold",
        numero: "1234********1234",
        exp: "12/25",
        titular: "Usuario Demo",
        moneda: "CRC",
        limite: 500000,
        saldo: 125000
      },
      {
        tipo: "Platinum", 
        numero: "5678********5678",
        exp: "06/26",
        titular: "Usuario Demo",
        moneda: "USD",
        limite: 10000,
        saldo: 2500
      }
    ]
  });

  const userData = currentUser || getDemoUser();
  const saldoTotal = userData.cuentas?.reduce((total, cuenta) => total + cuenta.saldo, 0) || 0;
  const cantidadCuentas = userData.cuentas?.length || 0;
  const cantidadTarjetas = userData.tarjetas?.length || 0;

  // Función para navegar con ID de usuario
  const navigateWithId = (path) => {
    if (currentUser && currentUser.id !== 0) {
      navigate(`/${path}/${currentUser.id}`);
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="welcome-section">
          <h1>¡Bienvenido, {userData.nombre}! <FiActivity className="welcome-icon" /></h1>
          <p className="welcome-subtitle">
            {currentUser && currentUser.id !== 0 
              ? "Es un placer tenerte de vuelta en tu banca en línea" 
              : "Explora las funcionalidades de nuestra plataforma bancaria"
            }
          </p>
          {(!currentUser || currentUser.id === 0) && (
            <p className="demo-notice">
              💡 Actualmente estás viendo datos de demostración. Regístrate para ver tu información personal.
            </p>
          )}
        </div>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-info">
              <h4>Saldo Total</h4>
              <p className="stat-amount">₡{saldoTotal.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <span className="stat-subtitle">En todas tus cuentas</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiHome />
            </div>
            <div className="stat-info">
              <h4>Cuentas Activas</h4>
              <p className="stat-amount">{cantidadCuentas}</p>
              <span className="stat-subtitle">Cuentas registradas</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiCreditCard />
            </div>
            <div className="stat-info">
              <h4>Tarjetas</h4>
              <p className="stat-amount">{cantidadTarjetas}</p>
              <span className="stat-subtitle">Tarjetas asociadas</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiActivity />
            </div>
            <div className="stat-info">
              <h4>Último Acceso</h4>
              <p className="stat-amount">{currentUser && currentUser.id !== 0 ? 'Hoy' : 'Demo'}</p>
              <span className="stat-subtitle">{new Date().toLocaleDateString('es-CR')}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <div className="card-header">
              <FiInfo className="card-icon" />
              <h3>Sobre la Aplicación</h3>
            </div>
            <p>Plataforma bancaria en línea desarrollada como parte del Proyecto 1 del curso IC8057 - Introducción al Desarrollo de Páginas Web del Instituto Tecnológico de Costa Rica.</p>
          </div>
          
          <div className="info-card">
            <div className="card-header">
              <FiTarget className="card-icon" />
              <h3>Objetivos del Proyecto</h3>
            </div>
            <ul>
              <li>Diseño mobile-first responsive</li>
              <li>Accesibilidad WCAG 2.1 AA</li>
              <li>Experiencia de usuario optimizada</li>
              <li>Estructura semántica HTML5</li>
              <li>Simulación de flujos bancarios</li>
            </ul>
          </div>
        </div>

        <div className="quick-actions">
          <h3><FiZap className="action-title-icon" /> Acciones Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigateWithId('transferencias')}>
              <FiRepeat className="action-icon" />
              <span>Transferencias</span>
              <FiArrowRight className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigateWithId('pagos')}>
              <FiDollarSign className="action-icon" />
              <span>Pagos</span>
              <FiArrowRight className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigateWithId('cuentas')}>
              <FiHome className="action-icon" />
              <span>Mis Cuentas</span>
              <FiArrowRight className="action-arrow" />
            </button>
            <button className="action-btn" onClick={() => navigateWithId('tarjetas')}>
              <FiCreditCard className="action-icon" />
              <span>Tarjetas</span>
              <FiArrowRight className="action-arrow" />
            </button>
          </div>
        </div>

        {currentUser && currentUser.id !== 0 && (
          <div className="user-info-section">
            <div className="info-card">
              <div className="card-header">
                <FiInfo className="card-icon" />
                <h3>Tu Información</h3>
              </div>
              <div className="user-details">
                <p><strong>Usuario:</strong> {currentUser.username}</p>
                <p><strong>Correo:</strong> {currentUser.correo}</p>
                <p><strong>Fecha de registro:</strong> {new Date(currentUser.fechaRegistro).toLocaleDateString('es-CR')}</p>
                <p><strong>ID de usuario:</strong> {currentUser.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;