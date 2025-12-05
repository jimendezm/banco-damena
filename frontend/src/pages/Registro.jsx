import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Registro.module.css';
import { initializeSampleData, createUser, usernameExists, emailExists } from '../services/userService';
import { RegistrarUsuario } from "../../ConnectionAPI/apiFunciones";
import Alert from '../components/Alert';

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipoId: "",
    numId: "",
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

  useEffect(() => {
    initializeSampleData();
  }, []);

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
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!form.username || form.username.length < 4) {
      newErrors.username = "El username debe tener al menos 4 caracteres.";
    } else if (usernameExists(form.username)) {
      newErrors.username = "El username ya está en uso.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.correo || !emailRegex.test(form.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido.";
    } else if (emailExists(form.correo)) {
      newErrors.correo = "El correo electrónico ya está registrado.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!form.password || !passwordRegex.test(form.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (form.nacimiento) {
      const birthDate = new Date(form.nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.nacimiento = "Debes ser mayor de 18 años para registrarte.";
      }
    }

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
      setMensaje("Por favor, corrige los errores del formulario.");
      showAlert('warning', 'Formulario con Errores', 'Por favor, corrige los errores del formulario.');
      return;
    }

    try {
      const  result = await RegistrarUsuario(form.tipoId, form.numId, form.nombre, "", form.correo, form.telefono, form.username, form.password, "Cliente");
      console.log(result.message)
      if (result.status == "success") {
        setMensaje("Registro exitoso! Redirigiendo…");
        showAlert('success', '¡Registro Exitoso!', 'Tu cuenta ha sido creada correctamente. Redirigiendo...');

        setTimeout(() => {
          setIsLoading(false);
          navigate('/');
        }, 1500);

      } else {
        setMensaje("Error en el registro. Verifique sus datos y cambie su usuario y correo por uno no registrado");
        showAlert('error', 'Error en el Registro', 'Error en el registro. Verifique sus datos y cambie su usuario y correo por uno no registrado');
        setIsLoading(false);
      }

    } catch (error) {
      console.log(error)
      setMensaje("Error en el registro.");
      showAlert('error', 'Error del Sistema', 'Ha ocurrido un error en el sistema. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
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
          <p className={styles.registroSubtitle}>Complete sus datos para registrarse</p>
        </div>

        <form className={styles.registroForm} onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tipo de identificación *</label>
            <select name="tipoId" value={form.tipoId} onChange={handleChange} className={styles.formSelect}>
              <option value="">Seleccione</option>
              <option value="Cédula Nacional">Nacional</option>
              <option value="dimex">DIMEX</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Número de identificación *</label>
            <input type="text" name="numId" value={form.numId} onChange={handleChange}
              className={`${styles.formInput} ${errors.numId ? styles.inputError : ''}`} />
            {errors.numId && <span className={styles.errorText}>{errors.numId}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username *</label>
            <input type="text" name="username" value={form.username} onChange={handleChange}
              className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`} />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nombre completo *</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className={styles.formInput} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fecha de nacimiento *</label>
            <input type="date" name="nacimiento" value={form.nacimiento} onChange={handleChange}
              className={`${styles.formInput} ${errors.nacimiento ? styles.inputError : ''}`} />
            {errors.nacimiento && <span className={styles.errorText}>{errors.nacimiento}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo electrónico *</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange}
              className={`${styles.formInput} ${errors.correo ? styles.inputError : ''}`} />
            {errors.correo && <span className={styles.errorText}>{errors.correo}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Teléfono (opcional)</label>
            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
              className={styles.formInput} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Contraseña *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`} />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirmar contraseña *</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
              className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`} />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.terminosGroup}>
            <input type="checkbox" name="terminos" checked={form.terminos} onChange={handleChange}
              className={styles.terminosCheckbox} />
            <label className={styles.terminosLabel}>
              Acepto los <button type="button" className={styles.terminosLink}>términos y condiciones</button>
            </label>
          </div>

          {errors.terminos && <span className={styles.errorText}>{errors.terminos}</span>}

          <button type="submit" className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`} disabled={isLoading}>
            {isLoading ? 'Registrando…' : 'Crear Cuenta'}
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