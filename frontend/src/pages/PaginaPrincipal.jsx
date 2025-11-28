import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObtenerDatosUsuario } from "../../ConnectionAPI/apiFunciones";

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
    }, []);

    // ⛔ Evita que el componente crashee mientras se carga
    if (!userData) {
        return (
            <div className="dashboard-page">
                <p>Cargando datos del usuario...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
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
        </div>
    );
}
