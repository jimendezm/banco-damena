// components/Cuentas.jsx
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFilter, 
  FiSearch, 
  FiEye, 
  FiDollarSign,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiList
} from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { initializeSampleData, getUsers } from '../services/userService';
import '../styles/Cuentas.css';

function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const { idUsuario } = useParams();
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let userData;
    
    if (idUsuario) {
      // Buscar usuario por ID
      const usersData = getUsers();
      userData = usersData.users.find(u => u.id === parseInt(idUsuario));
    } else {
      // Usar datos de sessionStorage o demo
      const storedUser = sessionStorage.getItem('currentUser');
      userData = storedUser ? JSON.parse(storedUser) : null;
    }

    if (!userData) {
      // Cargar usuario demo
      const usersData = getUsers();
      userData = usersData.users.find(u => u.username === 'demo');
    }

    if (userData && userData.cuentas) {
      setCuentas(userData.cuentas);
      if (userData.cuentas.length > 0) {
        setCuentaSeleccionada(userData.cuentas[0]);
        cargarMovimientos(userData.cuentas[0].account_id);
      }
    }
  }, [idUsuario]);


  const cargarMovimientos = async (accountId) => {
    setCargando(true);
    // Simular carga de movimientos
    setTimeout(() => {
      const movimientosEjemplo = [
        {
          id: 'TXN-001',
          account_id: accountId,
          fecha: '2024-01-15T10:30:00Z',
          tipo: 'CREDITO',
          descripcion: 'Depósito de nómina',
          moneda: 'CRC',
          monto: 750000.00,
          saldo: 1523400.50
        },
        {
          id: 'TXN-002', 
          account_id: accountId,
          fecha: '2024-01-14T14:20:00Z',
          tipo: 'DEBITO',
          descripcion: 'Pago de servicios',
          moneda: 'CRC',
          monto: -45000.00,
          saldo: 773400.50
        },
        {
          id: 'TXN-003',
          account_id: accountId,
          fecha: '2024-01-13T09:15:00Z',
          tipo: 'DEBITO',
          descripcion: 'Compra supermercado',
          moneda: 'CRC',
          monto: -65000.00,
          saldo: 818400.50
        },
        {
          id: 'TXN-004',
          account_id: accountId,
          fecha: '2024-01-12T16:45:00Z',
          tipo: 'CREDITO',
          descripcion: 'Transferencia recibida',
          moneda: 'CRC',
          monto: 150000.00,
          saldo: 883400.50
        },
        {
          id: 'TXN-005',
          account_id: accountId,
          fecha: '2024-01-10T11:20:00Z',
          tipo: 'DEBITO',
          descripcion: 'Retiro cajero automático',
          moneda: 'CRC',
          monto: -50000.00,
          saldo: 733400.50
        },
        {
          id: 'TXN-006',
          account_id: accountId,
          fecha: '2024-01-08T08:45:00Z',
          tipo: 'CREDITO',
          descripcion: 'Intereses ganados',
          moneda: 'CRC',
          monto: 12500.00,
          saldo: 783400.50
        },
        {
          id: 'TXN-007',
          account_id: accountId,
          fecha: '2024-01-05T16:30:00Z',
          tipo: 'DEBITO',
          descripcion: 'Pago tarjeta crédito',
          moneda: 'CRC',
          monto: -120000.00,
          saldo: 663400.50
        }
      ];
      setMovimientos(movimientosEjemplo);
      setCargando(false);
    }, 800); // Tiempo de carga más corto para demo
  };

  const handleSeleccionarCuenta = (cuenta) => {
    setCuentaSeleccionada(cuenta);
    setBusqueda('');
    setFiltroTipo('todos');
    cargarMovimientos(cuenta.account_id);
  };

  const movimientosFiltrados = movimientos.filter(movimiento => {
    const coincideTipo = filtroTipo === 'todos' || movimiento.tipo === filtroTipo;
    const coincideBusqueda = movimiento.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideTipo && coincideBusqueda;
  });

  const formatearMoneda = (monto, moneda) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(monto);
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="cuentas-container">
        <div className="cuentas-header">
          <h1><FiHome className="header-icon" /> Mis Cuentas</h1>
          <p>Gestiona y consulta el estado de tus cuentas bancarias</p>

        </div>

        <div className="cuentas-content">
          {/* Panel lateral de cuentas */}
          <div className="cuentas-sidebar">
            <div className="sidebar-header">
              <h3>Tus Cuentas</h3>
              <span className="cuentas-count">{cuentas.length} cuenta(s)</span>
            </div>
            
            <div className="cuentas-list">
              {cuentas.map((cuenta) => (
                <div
                  key={cuenta.account_id}
                  className={`cuenta-item ${cuentaSeleccionada?.account_id === cuenta.account_id ? 'selected' : ''}`}
                  onClick={() => handleSeleccionarCuenta(cuenta)}
                >
                  <div className="cuenta-icon">
                    <FiDollarSign />
                  </div>
                  <div className="cuenta-info">
                    <h4>{cuenta.alias}</h4>
                    <p className="cuenta-number">{cuenta.account_id}</p>
                    <p className="cuenta-type">{cuenta.tipo} - {cuenta.moneda}</p>
                  </div>
                  <div className="cuenta-saldo">
                    <span className="saldo-amount">
                      {formatearMoneda(cuenta.saldo, cuenta.moneda)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel principal de detalles */}
          <div className="cuentas-main">
            {cuentaSeleccionada ? (
              <>
                <div className="detalle-header">
                  <div className="cuenta-detalle">
                    <h2>{cuentaSeleccionada.alias}</h2>
                    <div className="cuenta-meta">
                      <span className="account-number">{cuentaSeleccionada.account_id}</span>
                      <span className="account-type">{cuentaSeleccionada.tipo}</span>
                      <span className="account-currency">{cuentaSeleccionada.moneda}</span>
                    </div>
                  </div>
                  <div className="saldo-actual">
                    <h3>Saldo Disponible</h3>
                    <p className="saldo-total">
                      {formatearMoneda(cuentaSeleccionada.saldo, cuentaSeleccionada.moneda)}
                    </p>
                  </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="filtros-container">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Buscar en movimientos..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filtroTipo === 'todos' ? 'active' : ''}`}
                      onClick={() => setFiltroTipo('todos')}
                    >
                      <FiList /> Todos
                    </button>
                    <button
                      className={`filter-btn ${filtroTipo === 'CREDITO' ? 'active' : ''}`}
                      onClick={() => setFiltroTipo('CREDITO')}
                    >
                      <FiArrowUp /> Créditos
                    </button>
                    <button
                      className={`filter-btn ${filtroTipo === 'DEBITO' ? 'active' : ''}`}
                      onClick={() => setFiltroTipo('DEBITO')}
                    >
                      <FiArrowDown /> Débitos
                    </button>
                  </div>
                </div>

                {/* Lista de movimientos */}
                <div className="movimientos-container">
                  <h3>
                    <FiCalendar className="section-icon" />
                    Historial de Movimientos
                    <span className="movimientos-count">({movimientosFiltrados.length} movimientos)</span>
                  </h3>
                  
                  {cargando ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Cargando movimientos...</p>
                    </div>
                  ) : movimientosFiltrados.length > 0 ? (
                    <div className="movimientos-list">
                      {movimientosFiltrados.map((movimiento) => (
                        <div key={movimiento.id} className="movimiento-item">
                          <div className="movimiento-icon">
                            {movimiento.tipo === 'CREDITO' ? (
                              <FiArrowUp className="credito" />
                            ) : (
                              <FiArrowDown className="debito" />
                            )}
                          </div>
                          <div className="movimiento-info">
                            <h4>{movimiento.descripcion}</h4>
                            <p className="movimiento-fecha">
                              {formatearFecha(movimiento.fecha)}
                            </p>
                          </div>
                          <div className="movimiento-monto">
                            <span className={`monto ${movimiento.tipo.toLowerCase()}`}>
                              {movimiento.tipo === 'CREDITO' ? '+' : ''}
                              {formatearMoneda(movimiento.monto, movimiento.moneda)}
                            </span>
                            <p className="movimiento-saldo">
                              Saldo: {formatearMoneda(movimiento.saldo, movimiento.moneda)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <FiEye className="empty-icon" />
                      <p>No se encontraron movimientos</p>
                      <span>No hay movimientos que coincidan con los filtros aplicados</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <FiEye className="no-selection-icon" />
                <h3>Selecciona una cuenta</h3>
                <p>Elige una cuenta de la lista para ver sus detalles y movimientos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cuentas;