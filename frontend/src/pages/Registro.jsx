import { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      setMensaje(error);
    } else {
      setMensaje("Registro exitoso ✅");
      setTimeout(() => onChangePage("login"), 1500);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo de identificación:
          <select name="tipoId" value={form.tipoId} onChange={handleChange} required>
            <option value="">Seleccione</option>
            <option value="nacional">Nacional</option>
            <option value="dimex">DIMEX</option>
            <option value="pasaporte">Pasaporte</option>
          </select>
        </label>

        <label>
          Número de identificación:
          <input type="text" name="numId" value={form.numId} onChange={handleChange} required />
        </label>

        <label>
          Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>

        <label>
          Nombre completo:
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>

        <label>
          Fecha de nacimiento:
          <input type="date" name="nacimiento" value={form.nacimiento} onChange={handleChange} required />
        </label>

        <label>
          Correo electrónico:
          <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
        </label>

        <label>
          Teléfono:
          <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
        </label>

        <label>
          Contraseña:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <label>
          Confirmar contraseña:
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </label>

        <label>
          <input type="checkbox" name="terminos" checked={form.terminos} onChange={handleChange} />
          Acepto los términos y condiciones
        </label>

        <button type="submit">Registrar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Registro;
