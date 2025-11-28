import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";
import { ValidateTime } from "../scripts/ValidateTime";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  // Revisar autenticación
useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginTime = localStorage.getItem("loginTime");

    // Si falta algo → redirigir al login
    if ((!token || !userId || !loginTime) && !ValidateTime) {
        navigate("/");
    }
}, []);

  if (!userData) {
    return (
      <Layout>
        <div className="dashboard-page">
          <p>Cargando información...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="welcome-section">
          <h1>¡Bienvenido, {userData.nombre}!</h1>
          <p className="welcome-subtitle">Tu banca digital Damena</p>
        </div>

        {/* Aquí pondrás cuentas, tarjetas, todo dinámico */}
        <div className="user-info-section">
          <div className="info-card">
            <h3>Tu información</h3>
            <p><strong>Usuario:</strong> {userData.usuario}</p>
            <p><strong>Correo:</strong> {userData.correo}</p>
            <p><strong>ID:</strong> {userData.user_id}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
