import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiRepeat, 
  FiArrowRight, 
  FiUser, 
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiCheck,
  FiDownload,
  FiShare2,
  FiHome,
  FiSearch
} from 'react-icons/fi';
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
    },
    {
      account_id: "CR01-9900-1122-000000000012",
      nombre: "Laura Cristina Chaves Solís",
      alias: "Cuenta Corriente"
    },
    {
      account_id: "CR01-3344-5566-000000000013",
      nombre: "Roberto Carlos Méndez López", 
      alias: "Fondo Emergencia"
    }
  ];

  useEffect(() => {
    // Cargar usuario basado en el ID de la URL
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

    if (userData) {
      setCurrentUser(userData);
      if (userData.cuentas) {
        setCuentasPropias(userData.cuentas);
        // Establecer primera cuenta como origen por defecto
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

    // Si cambia la cuenta origen, actualizar moneda
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
    
    // Validar que no sea la misma cuenta
    if (formData.cuentaOrigen === formData.cuentaDestino) {
      alert('No puedes transferir a la misma cuenta');
      return false;
    }

    // Validar saldo suficiente
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
    
    // Simular validación de cuenta
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
      fecha: new Date().toISOString(),
      usuario: currentUser // ← Agregar información del usuario
    });

    setPasoActual(2);
  };

  const handleConfirmar = () => {
    // Simular procesamiento de transferencia
    setTimeout(() => {
      const comprobante = {
        id: `TXN-${Date.now()}`,
        ...confirmacionData,
        fechaProcesamiento: new Date().toISOString(),
        estado: 'COMPLETADA',
        referencia: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        usuarioId: currentUser?.id // ← Agregar ID del usuario
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
    // Simular descarga de comprobante
    const comprobanteTexto = `
      COMPROBANTE DE TRANSFERENCIA - BANCO DAMENA
      ===========================================
      Referencia: ${comprobanteData.referencia}
      Fecha: ${new Date(comprobanteData.fechaProcesamiento).toLocaleString('es-CR')}
      Estado: ${comprobanteData.estado}
      
      CLIENTE ORIGEN:
      Nombre: ${currentUser?.nombre || 'Usuario Demo'}
      ${currentUser?.id ? `ID: ${currentUser.id}` : 'Modo: Demostración'}
      
      CUENTA ORIGEN:
      Número: ${comprobanteData.cuentaOrigen.account_id}
      Alias: ${comprobanteData.cuentaOrigen.alias}
      Tipo: ${comprobanteData.cuentaOrigen.tipo}
      
      CUENTA DESTINO:
      Número: ${comprobanteData.cuentaDestino.account_id}
      ${comprobanteData.tipo === 'terceros' ? `Titular: ${comprobanteData.cuentaDestino.nombre}` : `Alias: ${comprobanteData.cuentaDestino.alias}`}
      ${comprobanteData.tipo === 'terceros' ? `Alias: ${comprobanteData.cuentaDestino.alias}` : ''}
      
      DETALLES DE LA TRANSFERENCIA:
      Monto: ${formatearMoneda(comprobanteData.monto, comprobanteData.moneda)}
      Tipo: ${comprobanteData.tipo === 'propias' ? 'Entre Mis Cuentas' : 'A Terceros'}
      Descripción: ${comprobanteData.descripcion || 'Sin descripción'}
      
      ¡Transferencia realizada con éxito!
      
      ---
      Banco Damena - Banca en Línea
      Sistema desarrollado para IC8057 - TEC
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
    <Layout>
      <div className="transferencias-container">
        <div className="transferencias-header">
          <h1><FiRepeat className="header-icon" /> Transferencias</h1>
          <p>Realiza transferencias entre tus cuentas o hacia otros clientes</p>
          {currentUser && currentUser.id && (
            <div className="user-id-notice">
              Usuario: {currentUser.nombre} (ID: {currentUser.id})
            </div>
          )}
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
                  <FiUser className="tipo-icon" />
                  <span>Entre Mis Cuentas</span>
                  <p>Transferir entre tus propias cuentas</p>
                </button>
                <button
                  className={`tipo-btn ${tipoTransferencia === 'terceros' ? 'activo' : ''}`}
                  onClick={() => handleTipoTransferenciaChange('terceros')}
                >
                  <FiUsers className="tipo-icon" />
                  <span>A Terceros</span>
                  <p>Transferir a otros clientes del banco</p>
                </button>
              </div>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label className="form-label">
                  <FiHome className="label-icon" />
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
                  <FiArrowRight className="label-icon" />
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
                      <FiSearch className="search-icon" />
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
                        <FiCheck className="check-icon" />
                        Cuenta válida: {cuentaDestinoValida.nombre}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FiDollarSign className="label-icon" />
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
                  <FiFileText className="label-icon" />
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
                Continuar <FiArrowRight className="btn-icon" />
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Confirmación */}
        {pasoActual === 2 && confirmacionData && (
          <div className="confirmacion-container">
            <div className="confirmacion-header">
              <FiCheck className="confirmacion-icon" />
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
                    <span className="dato-label">Moneda:</span>
                    <span className="dato-valor">{confirmacionData.moneda}</span>
                  </div>
                  <div className="dato-item">
                    <span className="dato-label">Descripción:</span>
                    <span className="dato-valor">
                      {confirmacionData.descripcion || 'Sin descripción'}
                    </span>
                  </div>
                  <div className="dato-item">
                    <span className="dato-label">Fecha:</span>
                    <span className="dato-valor">
                      {formatearFecha(confirmacionData.fecha)}
                    </span>
                  </div>
                  {currentUser && currentUser.id && (
                    <div className="dato-item">
                      <span className="dato-label">Usuario:</span>
                      <span className="dato-valor">
                        {currentUser.nombre} (ID: {currentUser.id})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="datos-section">
                <h3>Cuenta de Origen</h3>
                <div className="cuenta-info">
                  <span className="cuenta-numero">{confirmacionData.cuentaOrigen.account_id}</span>
                  <span className="cuenta-alias">{confirmacionData.cuentaOrigen.alias}</span>
                  <span className="cuenta-tipo">{confirmacionData.cuentaOrigen.tipo} - {confirmacionData.cuentaOrigen.moneda}</span>
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
                  <span className="cuenta-alias-destino">{confirmacionData.cuentaDestino.alias}</span>
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
              <FiCheck className="success-icon" />
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
                  {currentUser && currentUser.id && (
                    <div className="comprobante-item">
                      <span className="comprobante-label">Cliente:</span>
                      <span className="comprobante-valor">
                        {currentUser.nombre} (ID: {currentUser.id})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="comprobante-actions">
              <button
                onClick={descargarComprobante}
                className="btn-download"
              >
                <FiDownload className="btn-icon" />
                Descargar Comprobante
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary"
              >
                <FiShare2 className="btn-icon" />
                Imprimir
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
    </Layout>
  );
}

export default Transferencias;