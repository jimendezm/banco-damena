import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";
import { ValidateTime } from "../scripts/ValidateTime";
import { ObtenerDatosUsuario } from "../../ConnectionAPI/apiFunciones";
import PaginaPrincipal from "./PaginaPrincipal";
import Cuentas from "./Cuentas";
import Tarjetas from "./Tarjetas";
import Transferencias from "./Transferencias";
import Alert from '../components/Alert';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'warning',
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

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginTime = localStorage.getItem("loginTime");
    const identificacion = localStorage.getItem("identificacion");
    setToken(localToken);
    
    if (!localToken || !userId || !loginTime || !identificacion) {
        showAlert('warning', 'Sesión Expirada', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setTimeout(() => navigate("/"), 2000);
        return;
    }
  }, []);

  useEffect(() => {
    if (!ValidateTime()) {
        showAlert('warning', 'Sesión Expirada', 'Tu sesión ha expirado por inactividad.');
        setTimeout(() => navigate("/"), 2000);
        return;
    }

    const interval = setInterval(() => {
        console.log("Validando tiempo de sesión...");
        if (!ValidateTime()) {
            showAlert('warning', 'Sesión Expirada', 'Tu sesión ha expirado por inactividad.');
            setTimeout(() => navigate("/"), 2000);
        }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Alert
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />
      <Layout />
    </>
  );
}

export default Dashboard;