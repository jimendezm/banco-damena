import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUsers } from '../services/userService';
import '../styles/Transferencias.css';

function Transferencias() {
  const { idUsuario } = useParams(); 
  const [pasoActual, setPasoActual] = useState(1);
  const [tipoTransferencia, setTipoTransferencia] = useState('propias');
  const [cuentasPropias, setCuentasPropias] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    cuentaOrigen: '',
    cuentaDestino: '',
    monto: '',
    moneda: 'CRC',
    descripcion: ''
  });
  const [confirmacionData, setConfirmacionData] = useState(null);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [busquedaTerceros, setBusquedaTerceros] = useState('');
  const [cuentaDestinoValida, setCuentaDestinoValida] = useState(null);
  const [validandoCuenta, setValidandoCuenta] = useState(false);

  // Datos de ejemplo de terceros
  const cuentasTerceros = [
    {
      account_id: "CR01-1122-3344-000000000010",
      nombre: "Ana María González Rojas",
      alias: "Cuenta Personal"
    },
    {
      account_id: "CR01-5566-7788-000000000011", 
      nombre: "José Alberto Pérez Mora",
      alias: "Ahorro Familiar"
    }
  ];

  useEffect(() => {
    let userData;
    
    if (idUsuario) {
      const usersData = getUsers();
      userData = usersData.users.find(u => u.id === parseInt(idUsuario));
    } else {
      const storedUser = sessionStorage.getItem('currentUser');
      userData = storedUser ? JSON.parse(storedUser) : null;
    }

    if (!userData) {
      const usersData = getUsers();
      userData = usersData.users.find(u => u.username === 'demo');
    }

    if (userData) {
      setCurrentUser(userData);
      if (userData.cuentas) {
        setCuentasPropias(userData.cuentas);
        if (userData.cuentas.length > 0) {
          setFormData(prev => ({
            ...prev,
            cuentaOrigen: userData.cuentas[0].account_id,
            moneda: userData.cuentas[0].moneda
          }));
        }
      }
    }
  }, [idUsuario]);

  const handleTipoTransferenciaChange = (tipo) => {
    setTipoTransferencia(tipo);
    setFormData({
      cuentaOrigen: formData.cuentaOrigen,
      cuentaDestino: '',
      monto: '',
      moneda: formData.moneda,
      descripcion: ''
    });
    setPasoActual(1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'cuentaOrigen') {
      const cuentaSeleccionada = cuentasPropias.find(c => c.account_id === value);
      if (cuentaSeleccionada) {
        setFormData(prev => ({
          ...prev,
          moneda: cuentaSeleccionada.moneda
        }));
      }
    }
  };

  const validarFormulario = () => {
    if (!formData.cuentaOrigen) return false;
    if (!formData.cuentaDestino) return false;
    if (!formData.monto || parseFloat(formData.monto) <= 0) return false;
    
    if (formData.cuentaOrigen === formData.cuentaDestino) {
      alert('No puedes transferir a la misma cuenta');
      return false;
    }

    const cuentaOrigen = cuentasPropias.find(c => c.account_id === formData.cuentaOrigen);
    if (cuentaOrigen && parseFloat(formData.monto) > cuentaOrigen.saldo) {
      alert('Saldo insuficiente para realizar la transferencia');
      return false;
    }

    return true;
  };

  const validarCuentaDestino = () => {
    if (!formData.cuentaDestino) return;

    setValidandoCuenta(true);
    
    setTimeout(() => {
      let cuentaValida = null;
      
      if (tipoTransferencia === 'propias') {
        cuentaValida = cuentasPropias.find(c => c.account_id === formData.cuentaDestino);
      } else {
        cuentaValida = cuentasTerceros.find(c => c.account_id === formData.cuentaDestino);
      }
      
      setCuentaDestinoValida(cuentaValida);
      setValidandoCuenta(false);
    }, 1500);
  };

  const handleContinuar = () => {
    if (!validarFormulario()) return;

    const cuentaOrigen = cuentasPropias.find(c => c.account_id === formData.cuentaOrigen);
    let cuentaDestinoInfo = null;

    if (tipoTransferencia === 'propias') {
      cuentaDestinoInfo = cuentasPropias.find(c => c.account_id === formData.cuentaDestino);
    } else {
      cuentaDestinoInfo = cuentasTerceros.find(c => c.account_id === formData.cuentaDestino);
    }

    setConfirmacionData({
      tipo: tipoTransferencia,
      cuentaOrigen: cuentaOrigen,
      cuentaDestino: cuentaDestinoInfo,
      monto: parseFloat(formData.monto),
      moneda: formData.moneda,
      descripcion: formData.descripcion,
      fecha: new Date().toISOString()
    });

    setPasoActual(2);
  };

  const handleConfirmar = () => {
    setTimeout(() => {
      const comprobante = {
        id: `TXN-${Date.now()}`,
        ...confirmacionData,
        fechaProcesamiento: new Date().toISOString(),
        estado: 'COMPLETADA',
        referencia: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      setComprobanteData(comprobante);
      setPasoActual(3);
    }, 2000);
  };

  const handleNuevaTransferencia = () => {
    setPasoActual(1);
    setFormData({
      cuentaOrigen: formData.cuentaOrigen,
      cuentaDestino: '',
      monto: '',
      moneda: formData.moneda,
      descripcion: ''
    });
    setConfirmacionData(null);
    setComprobanteData(null);
    setCuentaDestinoValida(null);
  };

  const descargarComprobante = () => {
    const comprobanteTexto = `
      COMPROBANTE DE TRANSFERENCIA - BANCO DAMENA
      ===========================================
      Referencia: ${comprobanteData.referencia}
      Fecha: ${new Date(comprobanteData.fechaProcesamiento).toLocaleString('es-CR')}
      Estado: ${comprobanteData.estado}
      
      CUENTA ORIGEN:
      Número: ${comprobanteData.cuentaOrigen.account_id}
      Alias: ${comprobanteData.cuentaOrigen.alias}
      Tipo: ${comprobanteData.cuentaOrigen.tipo}
      
      CUENTA DESTINO:
      Número: ${comprobanteData.cuentaDestino.account_id}
      ${comprobanteData.tipo === 'terceros' ? `Titular: ${comprobanteData.cuentaDestino.nombre}` : `Alias: ${comprobanteData.cuentaDestino.alias}`}
      
      DETALLES:
      Monto: ${formatearMoneda(comprobanteData.monto, comprobanteData.moneda)}
      Tipo: ${comprobanteData.tipo === 'propias' ? 'Entre Mis Cuentas' : 'A Terceros'}
      Descripción: ${comprobanteData.descripcion || 'Sin descripción'}
      
      ¡Transferencia realizada con éxito!
    `;
    
    const blob = new Blob([comprobanteTexto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante-${comprobanteData.referencia}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatearMoneda = (monto, moneda) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2
    }).format(monto);
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cuentasDestinoDisponibles = tipoTransferencia === 'propias' 
    ? cuentasPropias.filter(c => c.account_id !== formData.cuentaOrigen)
    : cuentasTerceros.filter(c => 
        c.account_id.includes(busquedaTerceros) || 
        c.nombre.toLowerCase().includes(busquedaTerceros.toLowerCase()) ||
        c.alias.toLowerCase().includes(busquedaTerceros.toLowerCase())
      );

  return (
      <div className="transferencias-container">
        <div className="transferencias-header">
          <h1>
            <TransferIcon className="header-icon" /> 
            Transferencias
          </h1>
          <p>Realiza transferencias entre tus cuentas o hacia otros clientes</p>
        </div>

        {/* Indicador de pasos */}
        <div className="pasos-container">
          <div className={`paso ${pasoActual >= 1 ? 'activo' : ''}`}>
            <span className="paso-numero">1</span>
            <span className="paso-texto">Datos de Transferencia</span>
          </div>
          <div className={`paso ${pasoActual >= 2 ? 'activo' : ''}`}>
            <span className="paso-numero">2</span>
            <span className="paso-texto">Confirmación</span>
          </div>
          <div className={`paso ${pasoActual >= 3 ? 'activo' : ''}`}>
            <span className="paso-numero">3</span>
            <span className="paso-texto">Comprobante</span>
          </div>
        </div>

        {/* Paso 1: Formulario de transferencia */}
        {pasoActual === 1 && (
          <div className="formulario-transferencia">
            <div className="tipo-transferencia-selector">
              <h3>Selecciona el tipo de transferencia</h3>
              <div className="tipo-buttons">
                <button
                  className={`tipo-btn ${tipoTransferencia === 'propias' ? 'activo' : ''}`}
                  onClick={() => handleTipoTransferenciaChange('propias')}
                >
                  <UserIcon className="tipo-icon" />
                  <span>Entre Mis Cuentas</span>
                  <p>Transferir entre tus propias cuentas</p>
                </button>
                <button
                  className={`tipo-btn ${tipoTransferencia === 'terceros' ? 'activo' : ''}`}
                  onClick={() => handleTipoTransferenciaChange('terceros')}
                >
                  <UsersIcon className="tipo-icon" />
                  <span>A Terceros</span>
                  <p>Transferir a otros clientes del banco</p>
                </button>
              </div>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label className="form-label">
                  <HomeIcon className="label-icon" />
                  Cuenta de Origen *
                </label>
                <select
                  value={formData.cuentaOrigen}
                  onChange={(e) => handleInputChange('cuentaOrigen', e.target.value)}
                  className="form-select"
                >
                  <option value="">Selecciona una cuenta</option>
                  {cuentasPropias.map(cuenta => (
                    <option key={cuenta.account_id} value={cuenta.account_id}>
                      {cuenta.alias} - {formatearMoneda(cuenta.saldo, cuenta.moneda)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ArrowRightIcon className="label-icon" />
                  Cuenta de Destino *
                </label>
                
                {tipoTransferencia === 'propias' ? (
                  <select
                    value={formData.cuentaDestino}
                    onChange={(e) => handleInputChange('cuentaDestino', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Selecciona una cuenta destino</option>
                    {cuentasDestinoDisponibles.map(cuenta => (
                      <option key={cuenta.account_id} value={cuenta.account_id}>
                        {cuenta.alias} - {formatearMoneda(cuenta.saldo, cuenta.moneda)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <div className="search-box">
                      <SearchIcon className="search-icon" />
                      <input
                        type="text"
                        placeholder="Buscar por número de cuenta, nombre o alias..."
                        value={busquedaTerceros}
                        onChange={(e) => setBusquedaTerceros(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    
                    <select
                      value={formData.cuentaDestino}
                      onChange={(e) => {
                        handleInputChange('cuentaDestino', e.target.value);
                        validarCuentaDestino();
                      }}
                      className="form-select"
                    >
                      <option value="">Selecciona una cuenta de terceros</option>
                      {cuentasDestinoDisponibles.map(cuenta => (
                        <option key={cuenta.account_id} value={cuenta.account_id}>
                          {cuenta.account_id} - {cuenta.nombre} ({cuenta.alias})
                        </option>
                      ))}
                    </select>

                    {validandoCuenta && (
                      <div className="validando-cuenta">
                        <div className="loading-spinner"></div>
                        Validando cuenta destino...
                      </div>
                    )}

                    {cuentaDestinoValida && !validandoCuenta && (
                      <div className="cuenta-validada">
                        <CheckIcon className="check-icon" />
                        Cuenta válida: {cuentaDestinoValida.nombre}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <DollarIcon className="label-icon" />
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.monto}
                    onChange={(e) => handleInputChange('monto', e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                  <span className="moneda-indicator">{formData.moneda}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Moneda</label>
                  <select
                    value={formData.moneda}
                    onChange={(e) => handleInputChange('moneda', e.target.value)}
                    className="form-select"
                    disabled
                  >
                    <option value="CRC">Colones (₡)</option>
                    <option value="USD">Dólares ($)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileIcon className="label-icon" />
                  Descripción (Opcional)
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Ej: Pago de servicios, Transferencia familiar, etc."
                  className="form-textarea"
                  maxLength="255"
                />
                <div className="contador-caracteres">
                  {formData.descripcion.length}/255 caracteres
                </div>
              </div>

              <button
                onClick={handleContinuar}
                disabled={!validarFormulario()}
                className="continuar-btn"
              >
                Continuar <ArrowRightIcon className="btn-icon" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Confirmación */}
        {pasoActual === 2 && confirmacionData && (
          <div className="confirmacion-container">
            <div className="confirmacion-header">
              <CheckIcon className="confirmacion-icon" />
              <h2>Confirma los datos de tu transferencia</h2>
              <p>Revisa cuidadosamente la información antes de confirmar</p>
            </div>

            <div className="confirmacion-datos">
              <div className="datos-section">
                <h3>Detalles de la Transferencia</h3>
                <div className="datos-grid">
                  <div className="dato-item">
                    <span className="dato-label">Tipo:</span>
                    <span className="dato-valor">
                      {confirmacionData.tipo === 'propias' ? 'Entre Mis Cuentas' : 'A Terceros'}
                    </span>
                  </div>
                  <div className="dato-item">
                    <span className="dato-label">Monto:</span>
                    <span className="dato-valor monto">
                      {formatearMoneda(confirmacionData.monto, confirmacionData.moneda)}
                    </span>
                  </div>
                  <div className="dato-item">
                    <span className="dato-label">Descripción:</span>
                    <span className="dato-valor">
                      {confirmacionData.descripcion || 'Sin descripción'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="datos-section">
                <h3>Cuenta de Origen</h3>
                <div className="cuenta-info">
                  <span className="cuenta-numero">{confirmacionData.cuentaOrigen.account_id}</span>
                  <span className="cuenta-alias">{confirmacionData.cuentaOrigen.alias}</span>
                </div>
              </div>

              <div className="datos-section">
                <h3>Cuenta de Destino</h3>
                <div className="cuenta-info">
                  <span className="cuenta-numero">{confirmacionData.cuentaDestino.account_id}</span>
                  {confirmacionData.tipo === 'propias' ? (
                    <span className="cuenta-alias">{confirmacionData.cuentaDestino.alias}</span>
                  ) : (
                    <span className="cuenta-nombre">{confirmacionData.cuentaDestino.nombre}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="confirmacion-actions">
              <button
                onClick={() => setPasoActual(1)}
                className="btn-secondary"
              >
                ← Volver a modificar
              </button>
              <button
                onClick={handleConfirmar}
                className="btn-primary"
              >
                Confirmar Transferencia
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Comprobante */}
        {pasoActual === 3 && comprobanteData && (
          <div className="comprobante-container">
            <div className="comprobante-header">
              <CheckIcon className="success-icon" />
              <h2>¡Transferencia Exitosa!</h2>
              <p>Tu transferencia se ha procesado correctamente</p>
            </div>

            <div className="comprobante-datos">
              <div className="comprobante-card">
                <h3>Comprobante de Transferencia</h3>
                <div className="comprobante-grid">
                  <div className="comprobante-item">
                    <span className="comprobante-label">Referencia:</span>
                    <span className="comprobante-valor">{comprobanteData.referencia}</span>
                  </div>
                  <div className="comprobante-item">
                    <span className="comprobante-label">Estado:</span>
                    <span className="comprobante-estado completada">{comprobanteData.estado}</span>
                  </div>
                  <div className="comprobante-item">
                    <span className="comprobante-label">Fecha y Hora:</span>
                    <span className="comprobante-valor">
                      {formatearFecha(comprobanteData.fechaProcesamiento)}
                    </span>
                  </div>
                  <div className="comprobante-item">
                    <span className="comprobante-label">Monto Transferido:</span>
                    <span className="comprobante-monto">
                      {formatearMoneda(comprobanteData.monto, comprobanteData.moneda)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="comprobante-actions">
              <button
                onClick={descargarComprobante}
                className="btn-download"
              >
                <DownloadIcon className="btn-icon" />
                Descargar Comprobante
              </button>
              <button
                onClick={handleNuevaTransferencia}
                className="btn-primary"
              >
                Nueva Transferencia
              </button>
            </div>
          </div>
        )}
      </div>
  );
}

// SVG Icons para Transferencias
const TransferIcon = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 10V12H16L10.5 17.5L11.92 18.92L19.84 11L11.92 3.08L10.5 4.5L16 10H4Z"/>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16 4C16 2.89 16.89 2 18 2C19.11 2 20 2.89 20 4C20 5.11 19.11 6 18 6C16.89 6 16 5.11 16 4ZM8 4C8 2.89 8.89 2 10 2C11.11 2 12 2.89 12 4C12 5.11 11.11 6 10 6C8.89 6 8 5.11 8 4ZM8 14C8 12.89 8.89 12 10 12C11.11 12 12 12.89 12 14C12 15.11 11.11 16 10 16C8.89 16 8 15.11 8 14ZM16 14C16 12.89 16.89 12 18 12C19.11 12 20 12.89 20 14C20 15.11 19.11 16 18 16C16.89 16 16 15.11 16 14ZM6 8C4.89 8 4 8.89 4 10C4 11.11 4.89 12 6 12C7.11 12 8 11.11 8 10C8 8.89 7.11 8 6 8ZM6 16C4.89 16 4 16.89 4 18C4 19.11 4.89 20 6 20C7.11 20 8 19.11 8 18C8 16.89 7.11 16 6 16ZM16.5 8C15.4 8 14.5 8.9 14.5 10C14.5 11.1 15.4 12 16.5 12C17.6 12 18.5 11.1 18.5 10C18.5 8.9 17.6 8 16.5 8ZM14.5 16C14.5 14.9 15.4 14 16.5 14C17.6 14 18.5 14.9 18.5 16C18.5 17.1 17.6 18 16.5 18C15.4 18 14.5 17.1 14.5 16Z"/>
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
  </svg>
);

const DollarIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM15.9 8.1C15.5 7.7 14.8 7.5 14.3 7.8L12.9 8.4C12.6 8.5 12.3 8.4 12.2 8.2C12 8 12.1 7.7 12.3 7.5L13.7 6.9C14.5 6.5 15.4 6.6 16.1 7.3C16.8 8 16.9 8.9 16.5 9.7L15.5 11.3C15.2 11.9 14.5 12.3 13.7 12.3H13V14H15V15H13V17H11V15H9V14H11V12.3H9.9C8.3 12.3 7 11 7 9.4C7 8.7 7.2 8 7.6 7.4L8.2 6.5C8.5 6 8.3 5.4 7.8 5.1C7.3 4.8 6.7 5 6.4 5.5L5.8 6.4C5.1 7.5 4.8 8.7 4.8 10C4.8 12.8 7 15 9.9 15H11V17H9V18H11V20H13V18H15V17H13V15H13.7C15.4 15 16.9 13.9 17.4 12.3L18.4 10.7C18.8 9.9 18.7 8.9 18.1 8.1Z"/>
  </svg>
);

const FileIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"/>
  </svg>
);

export default Transferencias;