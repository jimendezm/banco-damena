import { useState, useEffect } from "react";
import styles from "../styles/Tarjetas.module.css";
import { useParams, useNavigate } from "react-router-dom";
import logoDamenaSinFondoClaro from '../assets/logoDamenaSinFondoClaro.png';
import logoDamenaSinFondoOscuro from '../assets/logoDamenaSinFondo.png';
import { initializeSampleData, enviarTarjetas } from '../services/userService';

function Tarjetas() {
    const { idUsuario } = useParams();
    const navigate = useNavigate();

    const [tarjetas, setTarjetas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [mostrarResumen, setMostrarResumen] = useState(false);
    const [indiceFiltro, setIndiceFiltro] = useState(0);
    const [textoDescripcion, setTextoDescripcion] = useState("");

    const elementosFiltro = ["Ninguno", "Pago", "Compra"];
    const coloresTarjeta = {
        Gold: "#FFD700",
        Platinum: "#E5E4E2",
        Black: "#1C1C1C"
    };

    useEffect(() => {
        initializeSampleData();
        const tarjetasDelUsuario = enviarTarjetas(Number(idUsuario));

        
        if (tarjetasDelUsuario) {
            setTarjetas(tarjetasDelUsuario);
        } else {
            alert("Usuario no encontrado. Volviendo al login.");
            navigate("/", { replace: true });
        }
    }, [idUsuario, navigate]);

    if (tarjetas.length === 0) return null;

    const tarjetaActual = tarjetas[indice];
    if (!tarjetaActual) return null;

    const logo = tarjetaActual.tipo === "Black"
        ? logoDamenaSinFondoOscuro
        : logoDamenaSinFondoClaro;

    const siguiente = () => setIndice((prev) => (prev + 1) % tarjetas.length);
    const anterior = () => setIndice((prev) => (prev - 1 + tarjetas.length) % tarjetas.length);

    const cambiarElementoFiltro = () => {
        setIndiceFiltro((prev) => (prev + 1) % elementosFiltro.length);
    };

    const movimientosFiltrados = tarjetaActual.movimientos?.filter(m => {
        const cumpleTipo = elementosFiltro[indiceFiltro] === "Ninguno"
            || m.tipo.toUpperCase() === elementosFiltro[indiceFiltro].toUpperCase();
        const cumpleTexto = m.descripcion.toLowerCase().includes(textoDescripcion.toLowerCase());
        return cumpleTipo && cumpleTexto;
    }) ?? [];

    return (
        <div className={styles.contenedorSeccion}
            style={{
                background: `linear-gradient(145deg, ${coloresTarjeta[tarjetaActual.tipo]}80, white)`,
                color: tarjetaActual.tipo === "Black" ? "white" : "black"
            }}
        >
            <h2 className={styles.tituloSeccion}>Tus tarjetas</h2>

            <section className={styles.seccionTarjetas}>
                <button onClick={anterior}>{"<"}</button>
                <div
                    key={tarjetaActual.card_id}
                    className={styles.tarjeta}
                    style={{
                        background: `linear-gradient(135deg, ${coloresTarjeta[tarjetaActual.tipo]}80, ${coloresTarjeta[tarjetaActual.tipo]})`,
                        color: tarjetaActual.tipo === "Black" ? "white" : "black"
                    }}
                    onClick={() => setMostrarResumen(true)}
                >
                    <img className={styles.logoDamena} src={logo} alt="logo damena" />
                    <h3>{tarjetaActual.tipo} Card</h3>
                    <p><b>Número:</b> {tarjetaActual.numero}</p>
                    <p><b>Exp:</b> {tarjetaActual.exp}</p>
                    <p><b>Titular:</b> {tarjetaActual.titular}</p>
                    <p><b>Saldo:</b> {tarjetaActual.saldo} {tarjetaActual.moneda}</p>
                </div>
                <button onClick={siguiente}>{">"}</button>
            </section>

            {mostrarResumen && (
                <div className={styles.overlay}>
                    <div className={styles.resumenCuenta}>
                        <h3>Resumen de la tarjeta</h3>
                        <input
                            type="text"
                            className={styles.filtroDescripcion}
                            placeholder="Busca un movimiento por su descripcion..."
                            value={textoDescripcion}
                            onChange={(e) => setTextoDescripcion(e.target.value)}
                        />
                        <button
                            className={styles.botonFiltro}
                            onClick={cambiarElementoFiltro}
                        >
                            Filtrar por: {elementosFiltro[indiceFiltro]}
                        </button>

                        <p style={{ color: "Black" }}><b>Últimos movimientos:</b></p>
                        {movimientosFiltrados.length > 0 ? (
                            movimientosFiltrados.map(m => (
                                <p style={{ color: "Black" }} key={m.id}>
                                    {m.fecha} - {m.tipo} - {m.descripcion}
                                </p>
                            ))
                        ) : (
                            <p style={{ color: "Black" }}>No hay movimientos que coincidan</p>
                        )}

                        <button className={styles.botonDatosTarjeta}>
                            Mostrar Datos de la tarjeta
                        </button>
                        <button
                            className={styles.cerrarResumen}
                            onClick={() => { setMostrarResumen(false); setIndiceFiltro(0); setTextoDescripcion(""); }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tarjetas;
