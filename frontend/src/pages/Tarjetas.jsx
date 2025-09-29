import { useState, useEffect } from "react";
import styles from "../styles/Tarjetas.module.css";
import { useParams, useNavigate } from "react-router-dom";
import logoDamenaSinFondoClaro from '../assets/logoDamenaSinFondoClaro.png';
import logoDamenaSinFondoOscuro from '../assets/logoDamenaSinFondo.png';
import { initializeSampleData, enviarTarjetas } from '../services/userService';
import Layout from '../components/Layout';

// Modal para Consultar PIN
function ModalConsultarPIN({ tarjeta, onClose }) {
    const [paso, setPaso] = useState(1);
    const [codigo, setCodigo] = useState("");
    const [tiempoRestante, setTiempoRestante] = useState(10);

    useEffect(() => {
        if (paso === 2) {
            setTiempoRestante(10);
            const intervalo = setInterval(() => {
                setTiempoRestante((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalo);
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(intervalo);
        }
    }, [paso, onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modalPin}>
                {paso === 1 && (
                    <>
                        <h3>Verificación de identidad</h3>
                        <p>Ingresa el código enviado a tu correo o SMS:</p>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            className={styles.inputCodigo}
                            placeholder="Código de verificación"
                        />
                        <button
                            className={styles.botonContinuar}
                            onClick={() => {
                                if (codigo.trim() !== "") {
                                    setPaso(2);
                                } else {
                                    alert("Debes ingresar el código");
                                }
                            }}
                        >
                            Continuar
                        </button>
                        <button className={styles.botonCancelar} onClick={onClose}>
                            Cancelar
                        </button>
                    </>
                )}

                {paso === 2 && (
                    <>
                        <h3>Datos sensibles</h3>
                        <p><b>Tarjeta:</b> {tarjeta.tipo} - ****{tarjeta.numero.slice(-4)}</p>
                        <p><b>CVV:</b> {tarjeta.cvv}</p>
                        <p><b>PIN:</b> {tarjeta.pin}</p>
                        <p style={{ color: "red" }}>
                            Esta información desaparecerá en {tiempoRestante} segundos
                        </p>
                        <button className={styles.botonCerrar} onClick={onClose}>
                            Cerrar ahora
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function Tarjetas() {
    const { idUsuario } = useParams();
    const navigate = useNavigate();

    const [tarjetas, setTarjetas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [mostrarResumen, setMostrarResumen] = useState(false);
    const [mostrarConsultarPIN, setMostrarConsultarPIN] = useState(false);
    const [indiceFiltro, setIndiceFiltro] = useState(0);
    const [textoDescripcion, setTextoDescripcion] = useState("");
    const [filtroAplicado, setFiltroAplicado] = useState(0); // filtro activo al hacer click
    const [textoFiltrado, setTextoFiltrado] = useState(""); // texto al filtrar

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

    const aplicarFiltro = () => {
        setFiltroAplicado(indiceFiltro);
        setTextoFiltrado(textoDescripcion);
    };

    const movimientosFiltrados = tarjetaActual.movimientos?.filter(m => {
        const cumpleTipo = elementosFiltro[filtroAplicado] === "Ninguno"
            || m.tipo.toUpperCase() === elementosFiltro[filtroAplicado].toUpperCase();
        const cumpleTexto = m.descripcion.toLowerCase().includes(textoFiltrado.toLowerCase());
        return cumpleTipo && cumpleTexto;
    }) ?? [];

    return (
        <Layout>
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

                        <select
                            className={styles.selectFiltro}
                            value={elementosFiltro[indiceFiltro]}
                            onChange={(e) => setIndiceFiltro(elementosFiltro.indexOf(e.target.value))}
                        >
                            {elementosFiltro.map((el, idx) => (
                                <option key={idx} value={el}>{el}</option>
                            ))}
                        </select>

                        {/* Botón para aplicar filtro */}
                        <button className={styles.botonFiltro} onClick={aplicarFiltro}>
                            Filtrar
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

                        <button
                            className={styles.botonDatosTarjeta}
                            onClick={() => setMostrarConsultarPIN(true)}
                        >
                            Consultar PIN
                        </button>

                        <button
                            className={styles.cerrarResumen}
                            onClick={() => {
                                setMostrarResumen(false);
                                setIndiceFiltro(0);
                                setFiltroAplicado(0);
                                setTextoDescripcion("");
                                setTextoFiltrado("");
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {mostrarConsultarPIN && (
                <ModalConsultarPIN
                    tarjeta={tarjetaActual}
                    onClose={() => setMostrarConsultarPIN(false)}
                />
            )}
        </div>
        </Layout>
    );
}

export default Tarjetas;
