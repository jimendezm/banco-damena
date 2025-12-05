import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Registro.module.css';
import { RegistrarUsuario } from "../../ConnectionAPI/apiFunciones";
import Alert from '../components/Alert';

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipoId: "Cédula Nacional", // Cambiado para mostrar "Cédula Nacional"
    numId: "",
    apellido: "", // Añadido campo apellido
    username: "",
    nombre: "",
    nacimiento: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    terminos: false,
  });

  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Formateo automático para número de identificación
    let processedValue = value;
    if (name === 'numId') {
      // Permite formato: 1-2345-6789 o 123456789
      processedValue = value.replace(/[^\d-]/g, ''); // Solo números y guiones
    } else if (name === 'telefono') {
      // Formato para teléfono: ####-####
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length > 4) {
        processedValue = `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        processedValue = digits;
      }
    }
    
    setForm({ ...form, [name]: type === "checkbox" ? checked : processedValue });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    // Validación de tipo de identificación
    if (!form.tipoId) {
      newErrors.tipoId = "Debe seleccionar un tipo de identificación.";
    }

    // Validación de número de identificación (acepta formatos: 123456789 o 1-2345-6789)
    if (!form.numId) {
      newErrors.numId = "El número de identificación es requerido.";
    } else {
      const cleanedId = form.numId.replace(/-/g, '');
      if (!/^\d{9}$/.test(cleanedId)) {
        newErrors.numId = "La identificación debe tener 9 dígitos (Ej: 1-2345-6789 o 123456789).";
      }
    }

    // Validación de username
    if (!form.username || form.username.length < 4) {
      newErrors.username = "El username debe tener al menos 4 caracteres.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "El username solo puede contener letras, números y guiones bajos.";
    }

    // Validación de nombre
    if (!form.nombre) {
      newErrors.nombre = "El nombre es requerido.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios.";
    }

    // Validación de apellido
    if (!form.apellido) {
      newErrors.apellido = "El apellido es requerido.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras y espacios.";
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.correo || !emailRegex.test(form.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido.";
    }

    // Validación de fecha de nacimiento
    if (!form.nacimiento) {
      newErrors.nacimiento = "La fecha de nacimiento es requerida.";
    } else {
      const birthDate = new Date(form.nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.nacimiento = "Debes ser mayor de 18 años para registrarte.";
      } else if (age > 120) {
        newErrors.nacimiento = "Fecha de nacimiento no válida.";
      }
    }

    // Validación de teléfono (si se proporciona)
    if (form.telefono && !/^\d{4}-\d{4}$/.test(form.telefono)) {
      newErrors.telefono = "El teléfono debe tener formato ####-####.";
    }

    // Validación de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }

    // Validación de confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    // Validación de términos y condiciones
    if (!form.terminos) {
      newErrors.terminos = "Debes aceptar los términos y condiciones.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje("");

    if (!validarFormulario()) {
      setIsLoading(false);
      showAlert('warning', 'Formulario con Errores', 'Por favor, corrige los errores del formulario.');
      return;
    }

    try {
      // Limpiar formato de identificación (quitar guiones)
      const cleanedId = form.numId.replace(/-/g, '');
      
      // Mapear "Cédula Nacional" del frontend a "Cédula Nacional" para el backend
      // Si el backend necesita "Cédula Física", lo mapeamos aquí
      const tipoIdBackend = form.tipoId === "Cédula Nacional" ? "Cédula Física" : form.tipoId;
      
      const result = await RegistrarUsuario(
        tipoIdBackend,           // tipo_identificacion - mapeado
        cleanedId,               // identificacion - sin guiones
        form.nombre,             // nombre
        form.apellido,           // apellido - ahora con valor real
        form.correo,             // correo
        form.telefono || " ",    // telefono - espacio si está vacío
        form.username,           // usuario
        form.password,           // contrasena
        "Cliente"                // rol
      );
      
      console.log("Resultado del registro:", result);
      
      if (result.success && result.status === "success") {
        showAlert('success', '¡Registro Exitoso!', 'Tu cuenta ha sido creada correctamente. Redirigiendo...');
        setMensaje("Registro exitoso! Redirigiendo…");

        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 2000);

      } else {
        let errorMsg = result.message || "Error en el registro.";
        
        // Traducir errores comunes del SP
        if (errorMsg.includes('Identificación') && errorMsg.includes('ya registrada')) {
          errorMsg = "El número de identificación ya está registrado.";
        } else if (errorMsg.includes('Correo') && errorMsg.includes('ya registrado')) {
          errorMsg = "El correo electrónico ya está registrado.";
        } else if (errorMsg.includes('Nombre de usuario') && errorMsg.includes('ya registrado')) {
          errorMsg = "El nombre de usuario ya está en uso.";
        } else if (errorMsg.includes('Tipo de identificación')) {
          errorMsg = "Tipo de identificación no válido.";
        } else if (errorMsg.includes('Rol')) {
          errorMsg = "Rol no válido.";
        }
        
        setMensaje(errorMsg);
        showAlert('error', 'Error en el Registro', errorMsg);
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Error en registro:", error);
      setMensaje("Error en el registro. Intente nuevamente.");
      showAlert('error', 'Error del Sistema', 'Ha ocurrido un error en el sistema. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  // Obtener fecha máxima para fecha de nacimiento (18 años atrás)
  const getMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className={styles.registroContainer}>
      <Alert
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />

      <div className={styles.registroCard}>

        <div className={styles.registroHeader}>
          <h2 className={styles.registroTitle}>Crear Cuenta</h2>
          <p className={styles.registroSubtitle}>Complete sus datos para registrarse en Banco Damena</p>
        </div>

        <form className={styles.registroForm} onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tipo de identificación *</label>
            <select 
              name="tipoId" 
              value={form.tipoId} 
              onChange={handleChange} 
              className={`${styles.formSelect} ${errors.tipoId ? styles.inputError : ''}`}
            >
              <option value="Cédula Nacional">Cédula Nacional</option>
              <option value="dimex">DIMEX</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
            {errors.tipoId && <span className={styles.errorText}>{errors.tipoId}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Número de identificación *</label>
            <div className={styles.inputWithHint}>
              <input 
                type="text" 
                name="numId" 
                value={form.numId} 
                onChange={handleChange}
                placeholder="Ej: 1-2345-6789 o 123456789"
                maxLength="11" // Para formato con guiones
                className={`${styles.formInput} ${errors.numId ? styles.inputError : ''}`} 
              />
              <span className={styles.inputHint}>9 dígitos</span>
            </div>
            {errors.numId && <span className={styles.errorText}>{errors.numId}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
              <label className={styles.formLabel}>Nombre *</label>
              <input 
                type="text" 
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange}
                placeholder="Ej: Juan"
                className={`${styles.formInput} ${errors.nombre ? styles.inputError : ''}`} 
              />
              {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
              <label className={styles.formLabel}>Apellido *</label>
              <input 
                type="text" 
                name="apellido" 
                value={form.apellido} 
                onChange={handleChange}
                placeholder="Ej: Pérez"
                className={`${styles.formInput} ${errors.apellido ? styles.inputError : ''}`} 
              />
              {errors.apellido && <span className={styles.errorText}>{errors.apellido}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username *</label>
            <div className={styles.inputWithHint}>
              <input 
                type="text" 
                name="username" 
                value={form.username} 
                onChange={handleChange}
                placeholder="Mínimo 4 caracteres"
                className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`} 
              />
              <span className={styles.inputHint}>Letras, números y _</span>
            </div>
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fecha de nacimiento *</label>
            <input 
              type="date" 
              name="nacimiento" 
              value={form.nacimiento} 
              onChange={handleChange}
              max={getMaxBirthDate()}
              className={`${styles.formInput} ${errors.nacimiento ? styles.inputError : ''}`} 
            />
            <div className={styles.dateHint}>Debes ser mayor de 18 años</div>
            {errors.nacimiento && <span className={styles.errorText}>{errors.nacimiento}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo electrónico *</label>
            <input 
              type="email" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange}
              placeholder="ejemplo@email.com"
              className={`${styles.formInput} ${errors.correo ? styles.inputError : ''}`} 
            />
            {errors.correo && <span className={styles.errorText}>{errors.correo}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Teléfono</label>
            <div className={styles.inputWithHint}>
              <input 
                type="tel" 
                name="telefono" 
                value={form.telefono} 
                onChange={handleChange}
                placeholder="8888-8888"
                maxLength="9"
                className={`${styles.formInput} ${errors.telefono ? styles.inputError : ''}`} 
              />
              <span className={styles.inputHint}>Formato: ####-####</span>
            </div>
            {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
              <label className={styles.formLabel}>Contraseña *</label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange}
                placeholder="Cliente123"
                className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`} 
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
              <label className={styles.formLabel}>Confirmar contraseña *</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={form.confirmPassword} 
                onChange={handleChange}
                placeholder="Repita la contraseña"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`} 
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className={styles.passwordRequirements}>
            <p>Requisitos de contraseña:</p>
            <ul>
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una mayúscula</li>
              <li>Al menos una minúscula</li>
              <li>Al menos un número</li>
            </ul>
          </div>

          <div className={styles.terminosGroup}>
            <input 
              type="checkbox" 
              name="terminos" 
              checked={form.terminos} 
              onChange={handleChange}
              className={styles.terminosCheckbox} 
              id="terminos"
            />
            <label htmlFor="terminos" className={styles.terminosLabel}>
              Acepto los <button type="button" className={styles.terminosLink}>términos y condiciones</button>
            </label>
          </div>

          {errors.terminos && <span className={styles.errorText}>{errors.terminos}</span>}

          <button 
            type="submit" 
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Registrando…
              </>
            ) : 'Crear Cuenta'}
          </button>

        </form>

        {mensaje && (
          <p className={`${styles.mensaje} ${mensaje.includes("exitoso") ? styles.mensajeSuccess : styles.mensajeError}`}>
            {mensaje}
          </p>
        )}

        <div className={styles.loginLink}>
          ¿Ya tienes cuenta?{" "}
          <button className={styles.loginLinkButton} onClick={handleLoginRedirect}>
            Iniciar sesión
          </button>
        </div>

      </div>
    </div>
  );
}

export default Registro;