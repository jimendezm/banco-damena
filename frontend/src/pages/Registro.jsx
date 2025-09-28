import { useState } from "react";
import '../styles/Registro.css';

function Registro({ onChangePage }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    if (!form.username || form.username.length < 4) {
      return "El username debe tener al menos 4 caracteres.";
    }
    if (form.password !== form.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    if (!form.terminos) {
      return "Debes aceptar los términos y condiciones.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const error = validar();
    
    if (error) {
      setMensaje(error);
    } else {
      setMensaje("Registro exitoso ✅");
      setTimeout(() => {
        setIsLoading(false);
        onChangePage("login");
      }, 1500);
    }
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
              Tipo de identificación
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
              Número de identificación
            </label>
            <input 
              id="numId"
              type="text" 
              name="numId" 
              value={form.numId} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input 
              id="username"
              type="text" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre completo
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
              Fecha de nacimiento
            </label>
            <input 
              id="nacimiento"
              type="date" 
              name="nacimiento" 
              value={form.nacimiento} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">
              Correo electrónico
            </label>
            <input 
              id="correo"
              type="email" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input 
              id="password"
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              className="form-input"
              required 
            />
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
            onClick={() => onChangePage('login')}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registro;