import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← Importar useNavigate
import '../styles/Registro.css';
import { initializeSampleData, createUser, usernameExists, emailExists } from '../services/userService';

function Registro() {
  const navigate = useNavigate(); // ← Declarar useNavigate
  
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


  useEffect(() => {
    initializeSampleData();
  }, []);

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
      var age = today.getFullYear() - birthDate.getFullYear();
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
      return;
    }

    try {
      const result = createUser(form);
      
      if (result.success) {
        setMensaje("Registro exitoso! Redirigiendo al dashboard...");
        
        // Guardar usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // REDIRECCIÓN AL DASHBOARD CON ID después de 2 segundos
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/dashboard/${result.user.id}`); // ← Cambiado aquí
        }, 2000);
      } else {
        setMensaje(result.error || "Error en el registro. Intenta nuevamente.");
        setIsLoading(false);
      }
    } catch (error) {
      setMensaje("Error en el registro. Intenta nuevamente.");
      setIsLoading(false);
    }
  };
  
  const handleLoginRedirect = () => {
    navigate('/login');
  };


  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h2 className="registro-title">Crear Cuenta</h2>
          <p className="registro-subtitle">Complete sus datos para registrarse</p>
        </div>
        
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tipoId" className="form-label">
              Tipo de identificación *
            </label>
            <select 
              id="tipoId"
              name="tipoId" 
              value={form.tipoId} 
              onChange={handleChange} 
              className="form-select"
              required
            >
              <option value="">Seleccione</option>
              <option value="nacional">Nacional</option>
              <option value="dimex">DIMEX</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="numId" className="form-label">
              Número de identificación *
            </label>
            <input 
              id="numId"
              type="text" 
              name="numId" 
              value={form.numId} 
              onChange={handleChange} 
              className={`form-input ${errors.numId ? 'input-error' : ''}`}
              required 
            />
            {errors.numId && <span className="error-text">{errors.numId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input 
              id="username"
              type="text" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              className={`form-input ${errors.username ? 'input-error' : ''}`}
              required 
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre completo *
            </label>
            <input 
              id="nombre"
              type="text" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="nacimiento" className="form-label">
              Fecha de nacimiento *
            </label>
            <input 
              id="nacimiento"
              type="date" 
              name="nacimiento" 
              value={form.nacimiento} 
              onChange={handleChange} 
              className={`form-input ${errors.nacimiento ? 'input-error' : ''}`}
              required 
            />
            {errors.nacimiento && <span className="error-text">{errors.nacimiento}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              Correo electrónico *
            </label>
            <input 
              id="correo"
              type="email" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              className={`form-input ${errors.correo ? 'input-error' : ''}`}
              required 
            />
            {errors.correo && <span className="error-text">{errors.correo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono (opcional)
            </label>
            <input 
              id="telefono"
              type="tel" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChange} 
              className="form-input"
              placeholder="+506 XXXX XXXX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña *
            </label>
            <input 
              id="password"
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              required 
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña *
            </label>
            <input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              required 
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group terminos-group">
            <input 
              id="terminos"
              type="checkbox" 
              name="terminos" 
              checked={form.terminos} 
              onChange={handleChange} 
              className="terminos-checkbox"
            />
            <label htmlFor="terminos" className="terminos-label">
              Acepto los <button type="button" className="terminos-link">términos y condiciones</button>
            </label>
            {errors.terminos && <span className="error-text">{errors.terminos}</span>}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        {mensaje && (
          <p className={`mensaje ${mensaje.includes('✅') ? 'mensaje-success' : 'mensaje-error'}`}>
            {mensaje}
          </p>
        )}

        <div className="login-link">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button" 
            className="login-link-button"
            onClick={handleLoginRedirect}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registro;