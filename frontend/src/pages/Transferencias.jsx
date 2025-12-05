import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Transferencias.css';
import { ObtenerCuentasUsuario, CrearTransferenciaInterna } from "../../ConnectionAPI/apiFunciones";
import Alert from '../components/Alert';

function Transferencias() {
  const { idUsuario } = useParams(); 
  const [pasoActual, setPasoActual] = useState(1);
  const [tipoTransferencia, setTipoTransferencia] = useState('propias');
  const [cuentasPropias, setCuentasPropias] = useState([]);
  const [formData, setFormData] = useState({
    from_account_iban: '',
    to_account_iban: '',
    amount: '',
    currency_code: 'CRC',
    description: ''
  });
  const [confirmacionData, setConfirmacionData] = useState(null);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [shouldShowSingleAccountAlert, setShouldShowSingleAccountAlert] = useState(false);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'error',
    title: '',
    message: ''
  });

  const showAlert = useCallback((type, title, message) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message
    });
  }, []);

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  // Cargar cuentas
  useEffect(() => {
    const cargarCuentas = async () => {
      const token = localStorage.getItem('token');
      const idUsuario = localStorage.getItem('idUsuario');
      
      const result = await ObtenerCuentasUsuario(idUsuario, token);
      if (result.success) {
        setCuentasPropias(result.cuentas || []);
        console.log("Cuentas obtenidas (Transferencias):", result.cuentas);
        
        if (result.cuentas && result.cuentas.length > 0) {
          // Establecer primera cuenta como origen (usando IBAN)
          const primeraCuenta = result.cuentas[0];
          setFormData(prev => ({
            ...prev,
            from_account_iban: primeraCuenta.iban,
            currency_code: primeraCuenta.moneda_iso || primeraCuenta.currency || 'CRC'
          }));
        }
      } else {
        console.error("Error al obtener cuentas:", result.message);
        showAlert('error', 'Error', 'No se pudieron cargar las cuentas');
      }
      setIsLoadingAccounts(false);
    };
    
    cargarCuentas();
  }, [showAlert]);

  // Actualizar moneda cuando cambia la cuenta de origen
  useEffect(() => {
    if (formData.from_account_iban && cuentasPropias.length > 0) {
      const cuentaSeleccionada = cuentasPropias.find(c => c.iban === formData.from_account_iban);
      if (cuentaSeleccionada) {
        const monedaCuenta = cuentaSeleccionada.moneda_iso || cuentaSeleccionada.currency || 'CRC';
        if (monedaCuenta !== formData.currency_code) {
          setFormData(prev => ({
            ...prev,
            currency_code: monedaCuenta
          }));
        }
      }
    }
  }, [formData.from_account_iban, cuentasPropias]);

  // Mostrar alerta de cuenta única solo una vez
  useEffect(() => {
    if (!isLoadingAccounts && cuentasPropias.length === 1 && !shouldShowSingleAccountAlert) {
      const timer = setTimeout(() => {
        showAlert('info', 'Transferencia limitada', 
          'Necesitas al menos dos cuentas para realizar transferencias entre tus propias cuentas. ' +
          'Actualmente solo tienes una cuenta registrada.');
        setShouldShowSingleAccountAlert(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoadingAccounts, cuentasPropias.length, shouldShowSingleAccountAlert, showAlert]);

  const handleTipoTransferenciaChange = (tipo) => {
    setTipoTransferencia(tipo);
    setFormData(prev => ({
      ...prev,
      to_account_iban: '',
      amount: '',
      description: ''
    }));
    setPasoActual(1);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarFormulario = () => {
    // Verificar si hay al menos 2 cuentas para transferencias propias
    if (tipoTransferencia === 'propias' && cuentasPropias.length < 2) {
      return false;
    }

    if (!formData.from_account_iban) {
      return false;
    }

    if (!formData.to_account_iban) {
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return false;
    }

    if (!formData.currency_code) {
      return false;
    }
    
    if (formData.from_account_iban === formData.to_account_iban) {
      return false;
    }

    const cuentaOrigen = cuentasPropias.find(c => c.iban === formData.from_account_iban);
    if (cuentaOrigen && parseFloat(formData.amount) > cuentaOrigen.saldo) {
      return false;
    }

    const cuentaDestino = cuentasPropias.find(c => c.iban === formData.to_account_iban);
    
    if (cuentaOrigen && cuentaDestino) {
      const monedaOrigen = cuentaOrigen.moneda_iso || cuentaOrigen.currency || 'CRC';
      const monedaDestino = cuentaDestino.moneda_iso || cuentaDestino.currency || 'CRC';
      
      if (monedaOrigen !== monedaDestino) {
        return false;
      }
    }

    return true;
  };

  const handleContinuar = () => {
    const esValido = validarFormulario();
    
    if (!esValido) {
      // Solo mostrar alertas cuando el usuario intenta continuar
      if (tipoTransferencia === 'propias' && cuentasPropias.length < 2) {
        showAlert('warning', 'Transferencia no disponible', 
          'Necesitas al menos dos cuentas para realizar transferencias entre tus propias cuentas. ' +
          'Actualmente solo tienes una cuenta registrada.');
      } else if (!formData.from_account_iban) {
        showAlert('warning', 'Cuenta de Origen', 'Selecciona una cuenta de origen');
      } else if (!formData.to_account_iban) {
        showAlert('warning', 'Cuenta de Destino', 'Selecciona una cuenta de destino');
      } else if (!formData.amount || parseFloat(formData.amount) <= 0) {
        showAlert('warning', 'Monto Inválido', 'El monto debe ser mayor a cero');
      } else if (formData.from_account_iban === formData.to_account_iban) {
        showAlert('warning', 'Cuenta Duplicada', 'No puedes transferir a la misma cuenta');
      } else {
        const cuentaOrigen = cuentasPropias.find(c => c.iban === formData.from_account_iban);
        if (cuentaOrigen && parseFloat(formData.amount) > cuentaOrigen.saldo) {
          showAlert('error', 'Saldo Insuficiente', 'No tienes suficiente saldo para realizar esta transferencia');
        }
      }
      return;
    }

    const cuentaOrigen = cuentasPropias.find(c => c.iban === formData.from_account_iban);
    const cuentaDestino = cuentasPropias.find(c => c.iban === formData.to_account_iban);
    
    if (!cuentaOrigen || !cuentaDestino) {
      setError('Información de cuentas no válida');
      showAlert('error', 'Error', 'Información de cuentas no válida');
      return;
    }

    setConfirmacionData({
      tipo: tipoTransferencia,
      cuentaOrigen: cuentaOrigen,
      cuentaDestino: cuentaDestino,
      monto: parseFloat(formData.amount),
      moneda: formData.currency_code,
      descripcion: formData.description,
      fecha: new Date().toISOString(),
      formData: { ...formData }
    });

    setPasoActual(2);
    setError(null);
  };

  const handleConfirmar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (cuentasPropias.length < 2) {
        showAlert('warning', 'Transferencia no disponible', 'Necesitas al menos dos cuentas para realizar transferencias entre tus propias cuentas');
        setLoading(false);
        setPasoActual(1);
        return;
      }

      const transferData = {
        from_account_iban: formData.from_account_iban,
        to_account_iban: formData.to_account_iban,
        amount: parseFloat(formData.amount),
        currency_code: formData.currency_code,
        description: formData.description || ''
      };
      console.log("Datos de transferencia enviados:", transferData);
      const token = localStorage.getItem("token");
      const result = await CrearTransferenciaInterna(transferData, token);
      
      if (result.success) {
        const comprobante = {
          id: result.data?.transfer_id || `TXN-${Date.now()}`,
          ...confirmacionData,
          fechaProcesamiento: new Date().toISOString(),
          estado: 'COMPLETADA',
          referencia: result.data?.receipt_number || `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          transferResult: result.data
        };
        
        setComprobanteData(comprobante);
        setPasoActual(3);
        
        showAlert('success', '¡Transferencia Exitosa!', 'Tu transferencia se ha procesado correctamente');
        
        // Recargar cuentas para actualizar saldos
        setTimeout(() => {
          const recargarCuentas = async () => {
            const token = localStorage.getItem('token');
            const idUsuario = localStorage.getItem('idUsuario');
            const result = await ObtenerCuentasUsuario(idUsuario, token);
            if (result.success) {
              setCuentasPropias(result.cuentas || []);
            }
          };
          recargarCuentas();
        }, 1000);
      } else {
        const errorMessage = result.message || 'Error al procesar la transferencia';
        setError(errorMessage);
        
        if (result.error_code === 'INSUFFICIENT_FUNDS') {
          showAlert('error', 'Fondos Insuficientes', 'No tienes suficiente saldo para realizar esta transferencia.');
        } else if (result.error_code === 'ACCOUNT_INACTIVE') {
          showAlert('warning', 'Cuenta Inactiva', 'Una de las cuentas no está activa. Contacta al banco.');
        } else if (result.error_code === 'CURRENCY_MISMATCH') {
          showAlert('warning', 'Moneda Incorrecta', 'Las cuentas deben tener la misma moneda.');
        } else if (result.error_code === 'FORBIDDEN') {
          showAlert('error', 'Permiso Denegado', 'No tienes permiso para transferir desde esta cuenta.');
        } else if (result.error_code === 'SAME_ACCOUNT') {
          showAlert('warning', 'Cuenta Duplicada', 'No se puede transferir a la misma cuenta.');
        } else if (result.error_code === 'ACCOUNT_NOT_FOUND') {
          showAlert('error', 'Cuenta no Encontrada', 'La cuenta destino no existe.');
        } else if (result.error_code === 'INVALID_IBAN') {
          showAlert('error', 'IBAN Inválido', 'El número de cuenta es inválido.');
        } else if (result.error_code === 'INVALID_CURRENCY') {
          showAlert('error', 'Moneda Inválida', 'La moneda especificada no es válida.');
        } else {
          showAlert('error', 'Error', `Error: ${errorMessage}`);
        }
        setPasoActual(1);
      }
    } catch (error) {
      setError('Error de conexión al procesar la transferencia');
      showAlert('error', 'Error de Conexión', 'No se pudo conectar con el servidor. Intenta nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaTransferencia = () => {
    setPasoActual(1);
    setFormData(prev => ({
      ...prev,
      to_account_iban: '',
      amount: '',
      description: ''
    }));
    setConfirmacionData(null);
    setComprobanteData(null);
    setError(null);
  };

  const descargarComprobante = () => {
    if (!comprobanteData) return;
    
    const comprobanteTexto = `
      COMPROBANTE DE TRANSFERENCIA - BANCO DAMENA
      ===========================================
      Referencia: ${comprobanteData.referencia}
      Fecha: ${new Date(comprobanteData.fechaProcesamiento).toLocaleString('es-CR')}
      Estado: ${comprobanteData.estado}
      
      CUENTA ORIGEN:
      IBAN: ${comprobanteData.cuentaOrigen.iban || comprobanteData.cuentaOrigen.account_number}
      Alias: ${comprobanteData.cuentaOrigen.alias}
      Tipo: ${comprobanteData.cuentaOrigen.tipo_cuenta || 'Cuenta Corriente'}
      
      CUENTA DESTINO:
      IBAN: ${comprobanteData.cuentaDestino.iban || comprobanteData.cuentaDestino.account_number}
      Alias: ${comprobanteData.cuentaDestino.alias}
      Tipo: ${comprobanteData.cuentaDestino.tipo_cuenta || 'Cuenta Corriente'}
      
      DETALLES:
      Monto: ${formatearMoneda(comprobanteData.monto, comprobanteData.moneda)}
      Tipo: ${comprobanteData.tipo === 'propias' ? 'Entre Mis Cuentas' : 'Transferencia Interna'}
      Descripción: ${comprobanteData.descripcion || 'Sin descripción'}
      
      ¡Transferencia realizada con éxito!
      ID de Transacción: ${comprobanteData.id}
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
    
    showAlert('success', 'Comprobante Descargado', 'El comprobante se ha descargado correctamente');
  };

  const formatearMoneda = (monto, moneda) => {
    if (moneda === 'CRC') {
      return `₡${parseFloat(monto).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (moneda === 'USD') {
      return `$${parseFloat(monto).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${parseFloat(monto).toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${moneda}`;
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const cuentasDestinoDisponibles = cuentasPropias.filter(c => c.iban !== formData.from_account_iban);

  // Función para verificar si el botón debe estar deshabilitado
  const isContinuarDisabled = () => {
    return !validarFormulario() || loading || tipoTransferencia !== 'propias' || cuentasPropias.length < 2;
  };

  // Obtener cuenta por IBAN
  const getCuentaPorIban = (iban) => {
    return cuentasPropias.find(c => c.iban === iban);
  };

  // Formatear IBAN para mostrar
  const formatearIBAN = (iban) => {
    if (!iban) return '';
    // Formato: CRXX XXXX XXXX XXXX XXXX
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="transferencias-container">
      <Alert
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />

      <div className="transferencias-header">
        <h1>
          <TransferIcon className="header-icon" /> 
          Transferencias
        </h1>
        <p>Realiza transferencias entre tus cuentas o hacia otros clientes</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-large"></div>
          <p>Procesando transferencia...</p>
        </div>
      )}

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

      {pasoActual === 1 && (
        <div className="formulario-transferencia">
          <div className="tipo-transferencia-selector">
            <h3>Selecciona el tipo de transferencia</h3>
            <div className="tipo-buttons">
              <button
                className={`tipo-btn ${tipoTransferencia === 'propias' ? 'activo' : ''}`}
                onClick={() => handleTipoTransferenciaChange('propias')}
                disabled={cuentasPropias.length < 2}
              >
                <UserIcon className="tipo-icon" />
                <span>Entre Mis Cuentas</span>
                <p>Transferir entre tus propias cuentas</p>
                {cuentasPropias.length < 2 && (
                  <span className="coming-soon">Necesitas 2+ cuentas</span>
                )}
              </button>
              <button
                className={`tipo-btn ${tipoTransferencia === 'mismo-banco' ? 'activo' : ''}`}
                onClick={() => handleTipoTransferenciaChange('mismo-banco')}
                disabled
              >
                <UsersIcon className="tipo-icon" />
                <span>Mismo Banco</span>
                <p>Transferir a otros clientes del mismo banco</p>
                <span className="coming-soon">Próximamente</span>
              </button>
              <button
                className={`tipo-btn ${tipoTransferencia === 'interbancaria' ? 'activo' : ''}`}
                onClick={() => handleTipoTransferenciaChange('interbancaria')}
                disabled
              >
                <BankIcon className="tipo-icon" />
                <span>Interbancaria</span>
                <p>Transferir a cuentas de otros bancos</p>
                <span className="coming-soon">Próximamente</span>
              </button>
            </div>
          </div>

          <div className="form-container">
            {isLoadingAccounts ? (
              <div className="loading-accounts">
                <div className="loading-spinner"></div>
                <p>Cargando tus cuentas...</p>
              </div>
            ) : cuentasPropias.length === 0 ? (
              <div className="no-accounts">
                <p>No tienes cuentas disponibles para transferencias.</p>
              </div>
            ) : cuentasPropias.length === 1 ? (
              <div className="single-account-warning">
                <InfoIcon className="warning-icon" />
                <h4>Transferencia no disponible</h4>
                <p>Necesitas al menos dos cuentas para realizar transferencias entre tus propias cuentas.</p>
                <p>Actualmente solo tienes una cuenta registrada.</p>
                <button 
                  className="btn-primary"
                  onClick={() => showAlert('info', 'Agregar Cuenta', 'Contacta al banco para abrir una nueva cuenta.')}
                >
                  Solicitar nueva cuenta
                </button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <HomeIcon className="label-icon" />
                    Cuenta de Origen *
                  </label>
                  <select
                    value={formData.from_account_iban || ''}
                    onChange={(e) => handleInputChange('from_account_iban', e.target.value)}
                    className="form-select"
                    disabled={isLoadingAccounts}
                  >
                    <option value="">Selecciona una cuenta</option>
                    {cuentasPropias.map(cuenta => {
                      const monedaCuenta = cuenta.moneda_iso || cuenta.currency || 'CRC';
                      return (
                        <option key={cuenta.iban} value={cuenta.iban}>
                          {cuenta.alias} - {formatearIBAN(cuenta.iban)} - {formatearMoneda(cuenta.saldo, monedaCuenta)} ({monedaCuenta})
                        </option>
                      );
                    })}
                  </select>
                  {formData.from_account_iban && (
                    <div className="cuenta-info-selected">
                      <span className="cuenta-saldo">
                        Saldo disponible: {(() => {
                          const cuenta = getCuentaPorIban(formData.from_account_iban);
                          if (cuenta) {
                            const monedaCuenta = cuenta.moneda_iso || cuenta.currency || 'CRC';
                            return formatearMoneda(cuenta.saldo, monedaCuenta);
                          }
                          return '0.00';
                        })()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <ArrowRightIcon className="label-icon" />
                    Cuenta de Destino *
                  </label>
                  
                  {tipoTransferencia === 'propias' ? (
                    <>
                      <select
                        value={formData.to_account_iban || ''}
                        onChange={(e) => handleInputChange('to_account_iban', e.target.value)}
                        className="form-select"
                        disabled={!formData.from_account_iban || cuentasDestinoDisponibles.length === 0}
                      >
                        <option value="">Selecciona una cuenta destino</option>
                        {cuentasDestinoDisponibles.map(cuenta => {
                          const monedaCuenta = cuenta.moneda_iso || cuenta.currency || 'CRC';
                          return (
                            <option key={cuenta.iban} value={cuenta.iban}>
                              {cuenta.alias} - {formatearIBAN(cuenta.iban)} - {formatearMoneda(cuenta.saldo, monedaCuenta)} ({monedaCuenta})
                            </option>
                          );
                        })}
                      </select>
                      {cuentasDestinoDisponibles.length === 0 && formData.from_account_iban && (
                        <div className="no-destination-accounts">
                          <InfoIcon className="info-icon" />
                          <span>No hay otras cuentas disponibles para transferir</span>
                        </div>
                      )}
                    </>
                  ) : tipoTransferencia === 'mismo-banco' ? (
                    <div className="disabled-section">
                      <input
                        type="text"
                        placeholder="Ingresa el IBAN del destinatario"
                        className="form-input"
                        value={formData.to_account_iban || ''}
                        onChange={(e) => handleInputChange('to_account_iban', e.target.value)}
                      />
                      <small>Ejemplo: CR05152000010262840672</small>
                    </div>
                  ) : (
                    <div className="disabled-section">
                      <input
                        type="text"
                        placeholder="Ingresa el IBAN interbancario"
                        className="form-input"
                        disabled
                      />
                      <span className="coming-soon">Próximamente</span>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group monto-group">
                    <label className="form-label">
                      <DollarIcon className="label-icon" />
                      Monto *
                    </label>
                    <div className="monto-input-container">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.00"
                        className="form-input"
                        disabled={!formData.from_account_iban || !formData.to_account_iban}
                      />
                      <span className="moneda-indicator">{formData.currency_code}</span>
                    </div>
                    {formData.amount && formData.from_account_iban && (
                      <div className="saldo-restante">
                        Saldo después de transferencia: {(() => {
                          const cuenta = getCuentaPorIban(formData.from_account_iban);
                          if (cuenta) {
                            const nuevoSaldo = cuenta.saldo - parseFloat(formData.amount || 0);
                            return formatearMoneda(nuevoSaldo, formData.currency_code);
                          }
                          return '0.00';
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Moneda</label>
                    <select
                      value={formData.currency_code || 'CRC'}
                      onChange={(e) => handleInputChange('currency_code', e.target.value)}
                      className="form-select"
                      disabled={!formData.from_account_iban}
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
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Ej: Pago de servicios, Transferencia familiar, etc."
                    className="form-textarea"
                    maxLength="255"
                    disabled={!formData.from_account_iban || !formData.to_account_iban || !formData.amount}
                  />
                  <div className="contador-caracteres">
                    {(formData.description?.length || 0)}/255 caracteres
                  </div>
                </div>

                <button
                  onClick={handleContinuar}
                  disabled={isContinuarDisabled()}
                  className="continuar-btn"
                >
                  {loading ? 'Procesando...' : 'Continuar'} <ArrowRightIcon className="btn-icon" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
                    {confirmacionData.tipo === 'propias' ? 'Entre Mis Cuentas' : 
                     confirmacionData.tipo === 'mismo-banco' ? 'Mismo Banco' : 'Interbancaria'}
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
                <div className="dato-item">
                  <span className="dato-label">Fecha:</span>
                  <span className="dato-valor">
                    {formatearFecha(confirmacionData.fecha)}
                  </span>
                </div>
              </div>
            </div>

            <div className="datos-section">
              <h3>Cuenta de Origen</h3>
              <div className="cuenta-info origen">
                <span className="cuenta-numero">{formatearIBAN(confirmacionData.cuentaOrigen.iban)}</span>
                <span className="cuenta-alias">{confirmacionData.cuentaOrigen.alias}</span>
                <span className="cuenta-tipo">{confirmacionData.cuentaOrigen.tipo_cuenta || 'Cuenta Corriente'}</span>
                <span className="cuenta-saldo-origen">
                  Saldo antes: {formatearMoneda(confirmacionData.cuentaOrigen.saldo, confirmacionData.moneda)}
                </span>
              </div>
            </div>

            <div className="datos-section">
              <h3>Cuenta de Destino</h3>
              <div className="cuenta-info destino">
                <span className="cuenta-numero">{formatearIBAN(confirmacionData.cuentaDestino.iban)}</span>
                <span className="cuenta-alias">{confirmacionData.cuentaDestino.alias}</span>
                <span className="cuenta-tipo">{confirmacionData.cuentaDestino.tipo_cuenta || 'Cuenta Corriente'}</span>
              </div>
            </div>
          </div>

          <div className="confirmacion-actions">
            <button
              onClick={() => setPasoActual(1)}
              className="btn-secondary"
              disabled={loading}
            >
              ← Volver a modificar
            </button>
            <button
              onClick={handleConfirmar}
              className="btn-primary"
              disabled={loading || confirmacionData.tipo !== 'propias' || cuentasPropias.length < 2}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small-white"></div>
                  Procesando...
                </>
              ) : 'Confirmar Transferencia'}
            </button>
          </div>
        </div>
      )}

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
                  <span className="comprobante-valor referencia">{comprobanteData.referencia}</span>
                </div>
                <div className="comprobante-item">
                  <span className="comprobante-label">ID Transacción:</span>
                  <span className="comprobante-valor">{comprobanteData.id}</span>
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
                <div className="comprobante-item">
                  <span className="comprobante-label">Tipo:</span>
                  <span className="comprobante-valor">
                    {comprobanteData.tipo === 'propias' ? 'Entre Mis Cuentas' : 
                     comprobanteData.tipo === 'mismo-banco' ? 'Mismo Banco' : 'Interbancaria'}
                  </span>
                </div>
              </div>
            </div>

            <div className="comprobante-resumen">
              <div className="resumen-item">
                <span className="resumen-label">Cuenta Origen:</span>
                <span className="resumen-valor">{formatearIBAN(comprobanteData.cuentaOrigen.iban)}</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Cuenta Destino:</span>
                <span className="resumen-valor">
                  {formatearIBAN(comprobanteData.cuentaDestino.iban)}
                </span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Nuevo saldo origen:</span>
                <span className="resumen-valor">
                  {formatearMoneda(
                    comprobanteData.cuentaOrigen.saldo - comprobanteData.monto,
                    comprobanteData.moneda
                  )}
                </span>
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

// SVG Icons
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

const BankIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L2 8H5V20H19V8H22L12 2ZM11 10H13V18H11V10ZM7 10H9V18H7V10ZM15 10H17V18H15V10Z"/>
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

const InfoIcon = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"/>
  </svg>
);

export default Transferencias;