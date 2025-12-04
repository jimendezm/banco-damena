import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers } from '../services/userService';
import '../styles/Cuentas.css';
import { ObtenerCuentasUsuario, ObtenerTransaccionesCuenta } from '../../ConnectionAPI/apiFunciones';

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
    
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const idUsuario = localStorage.getItem('idUsuario');
      const result = await ObtenerCuentasUsuario(idUsuario, token);
      if (result.success) {
        setCuentas(result.cuentas);
        console.log("Cuentas obtenidas:", result.cuentas);
        if (result.cuentas.length > 0) {
          console.log("todo ok");
        }
      } else {
        console.error("Error al obtener cuentas:", result.message);
      };
    };
    fetchData();
  }, [idUsuario]);

    useEffect(() => {
      if (cuentas.length > 0) {
        setCuentaSeleccionada(cuentas[0]);
        cargarMovimientos(cuentas[0].id);
      }
    }, [cuentas]);

  const cargarMovimientos = async (accountId) => {
    const token = localStorage.getItem('token');
    setCargando(true);
    const movimientos = await ObtenerTransaccionesCuenta(accountId, token);
    setMovimientos(movimientos.transacciones || []);
      setCargando(false);
  };

  const handleSeleccionarCuenta = (cuenta) => {
    setCuentaSeleccionada(cuenta);
    setBusqueda('');
    setFiltroTipo('todos');
    console.log("Cuenta seleccionada:", cuenta.id);
    cargarMovimientos(cuenta.id);
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
    <div className="cuentas-container">
      <div className="cuentas-header">
        <h1>
          <HomeIcon className="header-icon" /> 
          Mis Cuentas
        </h1>
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
                key={cuenta.cuenta_id}
                className={`cuenta-item ${cuentaSeleccionada?.id === cuenta.id ? 'selected' : ''}`}
                onClick={() => handleSeleccionarCuenta(cuenta)}
              >
                <div className="cuenta-info">
                  <h4>{cuenta.alias}</h4>
                  <p className="cuenta-number">{cuenta.iban}</p>
                  <p className="cuenta-type">{cuenta.tipo_cuenta} - {cuenta.moneda_iso}</p>
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
                    <span className="account-number">{cuentaSeleccionada.iban}</span>
                    <span className="account-type">{cuentaSeleccionada.tipo_cuenta}</span>
                    <span className="account-currency">{cuentaSeleccionada.moneda_iso}</span>
                  </div>
                </div>
                <div className="saldo-actual">
                  <h3>Saldo Disponible</h3>
                  <p className="saldo-total">
                    {formatearMoneda(cuentaSeleccionada.saldo, cuentaSeleccionada.moneda_iso)}
                  </p>
                </div>
              </div>

              {/* Filtros y búsqueda */}
              <div className="filtros-container">
                <div className="search-box">
                  <SearchIcon className="search-icon" />
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
                    <ListIcon /> Todos
                  </button>
                  <button
                    className={`filter-btn ${filtroTipo === 'CREDITO' ? 'active' : ''}`}
                    onClick={() => setFiltroTipo('CREDITO')}
                  >
                    <ArrowUpIcon /> Créditos
                  </button>
                  <button
                    className={`filter-btn ${filtroTipo === 'DEBITO' ? 'active' : ''}`}
                    onClick={() => setFiltroTipo('DEBITO')}
                  >
                    <ArrowDownIcon /> Débitos
                  </button>
                </div>
              </div>

              {/* Lista de movimientos */}
              <div className="movimientos-container">
                <h3>
                  <CalendarIcon className="section-icon" />
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
                            <ArrowUpIcon className="credito" />
                          ) : (
                            <ArrowDownIcon className="debito" />
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
                    <EyeIcon className="empty-icon" />
                    <p>No se encontraron movimientos</p>
                    <span>No hay movimientos que coincidan con los filtros aplicados</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <EyeIcon className="no-selection-icon" />
              <h3>Selecciona una cuenta</h3>
              <p>Elige una cuenta de la lista para ver sus detalles y movimientos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SVG Icons para Cuentas
const HomeIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
  </svg>
);

const ListIcon = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 13H11V11H3V13ZM3 17H11V15H3V17ZM3 9H11V7H3V9ZM13 13H21V11H13V13ZM13 17H21V15H13V17ZM13 7V9H21V7H13Z"/>
  </svg>
);

const ArrowUpIcon = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 14L12 9L17 14H7Z"/>
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 10L12 15L17 10H7Z"/>
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"/>
  </svg>
);

export default Cuentas;