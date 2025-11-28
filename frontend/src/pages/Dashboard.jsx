import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";
import { ValidateTime } from "../scripts/ValidateTime";
import { ObtenerDatosUsuario } from "../../ConnectionAPI/apiFunciones";
import Sidebar from "../components/Sidebar";
import PaginaPrincipal from "./PaginaPrincipal";
import Tarjetas from "./Tarjetas";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [PaginaSeleccionada, setPaginaSeleccionada] = useState(<PaginaPrincipal />);

useEffect(() => {
    const localToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loginTime = localStorage.getItem("loginTime");
    const identificacion = localStorage.getItem("identificacion");
    setToken(localToken);
    // Si falta cualquier dato del login → fuera
    if (localToken == "" || userId == "" || loginTime == "" || identificacion == "") {
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
    }, 60 * 1000); // 1 min

    // Limpiar interval cuando se desmonta el Dashboard
    return () => clearInterval(interval);

}, []);
useEffect(() => {
    if (!ValidateTime()) {
        navigate("/");
        return;
    }
}, []);

  return (
    
    <section className="contenedorDashboard">
      <nav>
        
        <ul>
          <li><button onClick={() => setPaginaSeleccionada(<PaginaPrincipal />)} >Página Principal</button></li>
          <li><button onClick={() => setPaginaSeleccionada(<PaginaPrincipal />)}>Cuentas</button></li>
          <li><button onClick={() => setPaginaSeleccionada(<Tarjetas />)}>Tarjetas</button></li>
          <li><button onClick={() => setPaginaSeleccionada(<PaginaPrincipal />)}>Transferencias</button></li>
        </ul>
      </nav>
      <section className="contenedorDinamico">
        {PaginaSeleccionada}
      </section>
    </section>
  );
}

export default Dashboard;
