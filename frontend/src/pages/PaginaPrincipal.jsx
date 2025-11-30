import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObtenerDatosUsuario } from "../../ConnectionAPI/apiFunciones";
import '../styles/PaginaPrincipal.css';

export default function PaginaPrincipal() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const identificacion = localStorage.getItem("identificacion");

        if (!token || !identificacion) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            const result = await ObtenerDatosUsuario(identificacion, token);

            if (!result.success) {
                alert("Error obteniendo datos del usuario: " + result.message);
                navigate("/");
                return;
            }

            setUserData(result.userData);
            console.log("Datos del usuario obtenidos:", result.userData);
        };

        fetchData();
    }, [navigate]);

    if (!userData) {
        return (
            <div className="pagina-principal">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando datos del usuario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-principal">
            <div className="welcome-section">
                <h1>¡Bienvenido, {userData.nombre}!</h1>
                <p className="welcome-subtitle">Tu banca digital Damena</p>
            </div>

            <div className="user-info-section">
                <div className="info-card">
                    <h3>Tu información</h3>
                    <p><strong>Usuario:</strong> {userData.usuario}</p>
                    <p><strong>Correo:</strong> {userData.correo}</p>
                    <p><strong>ID:</strong> {userData.id}</p>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Acciones Rápidas</h3>
                <div className="actions-grid">
                    <div className="action-card">
                        <div className="action-icon">
                            <AccountIcon />
                        </div>
                        <h4>Ver Cuentas</h4>
                        <p>Consulta tus cuentas y movimientos</p>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">
                            <CardIcon />
                        </div>
                        <h4>Gestionar Tarjetas</h4>
                        <p>Administra tus tarjetas de crédito/débito</p>
                    </div>
                    <div className="action-card">
                        <div className="action-icon">
                            <TransferActionIcon />
                        </div>
                        <h4>Realizar Transferencias</h4>
                        <p>Transfiere dinero entre cuentas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// SVG Icons para las acciones
const AccountIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#25CB86">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
  </svg>
);

const CardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#25CB86">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const TransferActionIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#25CB86">
    <path d="M4 10v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z"/>
  </svg>
);