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

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginTime = localStorage.getItem("loginTime");
    const identificacion = localStorage.getItem("identificacion");
    setToken(localToken);
    
    if (!localToken || !userId || !loginTime || !identificacion) {
        navigate("/");
        return;
    }
  }, []);

  useEffect(() => {
    if (!ValidateTime()) {
        navigate("/");
        return;
    }

    const interval = setInterval(() => {
        console.log("Validando tiempo de sesión...");
        if (!ValidateTime()) {
            navigate("/");
        }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout />
  );
}

export default Dashboard;