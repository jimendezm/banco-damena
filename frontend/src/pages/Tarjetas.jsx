import { useState, useEffect } from "react";
import styles from "../styles/Tarjetas.module.css";
import Layout from "../components/Layout";
import {
    generateOTPTarjeta,
    ObtenerTarjetasUsuario,
    ObtenerTransaccionesTarjeta,
    ValidarOTPTarjeta
} from "../../ConnectionAPI/apiFunciones";

import logoDamenaClaro from '../assets/logoDamenaSinFondoClaro.png';
import logoDamenaOscuro from '../assets/logoDamenaSinFondo.png';

function Tarjetas() {

    const [tarjetas, setTarjetas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [mostrarModalMovimientos, setMostrarModalMovimientos] = useState(false);
    const [movimientos, setMovimientos] = useState([]);
    const [filtro, setFiltro] = useState("Todos");

    // MODAL OTP
    const [mostrarModalOTP, setMostrarModalOTP] = useState(false);
    const [codigoOTP, setCodigoOTP] = useState("");
    const [otpEnviado, setOtpEnviado] = useState(false);

    // MODAL DATOS SENSIBLES
    const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
    const [datosSensibles, setDatosSensibles] = useState(null);
    const [contador, setContador] = useState(60);

    // Obtener tarjetas
    useEffect(() => {
        const token = localStorage.getItem("token");
        const identificacion = localStorage.getItem("identificacion");

        const fetchData = async () => {
            const result = await ObtenerTarjetasUsuario(identificacion, token);

            if (result.success && Array.isArray(result.tarjetas)) {
                setTarjetas(result.tarjetas);
            } else {
                console.error("Error al obtener tarjetas:", result);
            }
        };

        fetchData();
    }, []);

    // Swipe en móvil
    useEffect(() => {
        const areaSwipe = document.getElementById("zonaSwipe");
        if (!areaSwipe) return;

        let touchStartX = 0;
        let touchEndX = 0;

        const start = (e) => (touchStartX = e.changedTouches[0].screenX);
        const end = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 60) diff > 0 ? siguiente() : anterior();
        };

        areaSwipe.addEventListener("touchstart", start);
        areaSwipe.addEventListener("touchend", end);

        return () => {
            areaSwipe.removeEventListener("touchstart", start);
            areaSwipe.removeEventListener("touchend", end);
        };
    }, [tarjetas]);

    // 🕒 COUNTDOWN PARA DATOS SENSIBLES
    useEffect(() => {
        if (!mostrarModalDatos) return;

        if (contador === 0) {
            setMostrarModalDatos(false);
            return;
        }

        const timer = setTimeout(() => {
            setContador(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [contador, mostrarModalDatos]);

    if (tarjetas.length === 0) {
        return (
            <section className={styles.contenedorPagina}>
                <section className={styles.contenedorPagina}>
                    <p className={styles.cargando}>Cargando tarjetas...</p>
                </section>
            </section>
        );
    }

    const tarjeta = tarjetas[indice];

    const colores = {
        Gold: "#FFD700",
        Platinum: "#E5E4E2",
        Black: "#1C1C1C",
        Crédito: "#0077ff",
        Débito: "#25CB86",
    };

    const logo = tarjeta.tipo === "Black" ? logoDamenaOscuro : logoDamenaClaro;

    const siguiente = () => setIndice((prev) => (prev + 1) % tarjetas.length);
    const anterior = () => setIndice((prev) => (prev - 1 + tarjetas.length) % tarjetas.length);

    // 🔐 Enviar OTP
    const enviarOTP = async () => {
        const token = localStorage.getItem("token");
        const result = await generateOTPTarjeta(tarjeta.id, token);

        if (result.success) {
            setOtpEnviado(true);
            console.log("OTP generado:", result.otp);
        } else {
            alert("Error al generar OTP: " + result.message);
        }
    };

    // 🔐 Confirmar OTP
    const confirmarOTP = async () => {
        const token = localStorage.getItem("token");
        console.log("Validando OTP:", codigoOTP);

        const result = await ValidarOTPTarjeta(tarjeta.id, codigoOTP, token);

        if (result.success) {
            console.log("Datos sensibles:", result.valid);

            setDatosSensibles(result.valid);
            setMostrarModalOTP(false);
            setCodigoOTP("");
            setOtpEnviado(false);

            setContador(60);
            setMostrarModalDatos(true);

        } else {
            alert("Error al verificar OTP: " + result.message);
            setCodigoOTP("");
        }
    };

    const abrirModalMovimientos = async () => {
        const token = localStorage.getItem("token");

        const result = await ObtenerTransaccionesTarjeta(tarjeta.id, token);
        const movs = result.movimientos || [];

        setMovimientos(movs);
        setMostrarModalMovimientos(true);
    };


    return (
        <section className={styles.contenedorPagina}>
            <section className={styles.contenedorPagina}>
                <div className={styles.contenedorSeccion}>
                    <h2 className={styles.tituloSeccion}>Tus Tarjetas</h2>

                    <section id="zonaSwipe" className={styles.seccionTarjetas}>
                        <button onClick={anterior} className={styles.btnNav}>{"<"}</button>

                        <div
                            className={styles.tarjeta}
                            style={{
                                background: `linear-gradient(135deg, ${colores[tarjeta.tipo]}80, ${colores[tarjeta.tipo]})`,
                                color: tarjeta.tipo === "Black" ? "white" : "black",
                            }}
                            onClick={() => setMostrarModalOTP(true)}
                        >
                            <img className={styles.logoDamena} src={logo} />
                            <h3>{tarjeta.tipo} Card</h3>
                            <p><b>Número:</b> {tarjeta.numero_enmascarado}</p>
                            <p><b>Expira:</b> {tarjeta.fecha_expiracion}</p>
                            <p><b>Límite:</b> {tarjeta.limite_credito} {tarjeta.moneda}</p>
                        </div>

                        <button onClick={siguiente} className={styles.btnNav}>{">"}</button>
                    </section>

                    <div className={styles.indicadores}>
                        {tarjetas.map((_, idx) => (
                            <span
                                key={idx}
                                className={`${styles.indicador} ${idx === indice ? styles.activo : ""}`}
                            ></span>
                        ))}
                    </div>

                    <button className={styles.botonMovimientos} onClick={abrirModalMovimientos}>
                        Ver movimientos
                    </button>
                </div>

                {/* MODAL OTP */}
                {mostrarModalOTP && (
                    <div className={styles.overlay}>
                        <div className={styles.modalOTP}>
                            <h3>Confirmación OTP</h3>
                            <p>Revisa tu correo e ingresa el código</p>

                            {!otpEnviado && (
                                <button className={styles.btnEnviarOTP} onClick={enviarOTP}>
                                    Enviar OTP
                                </button>
                            )}

                            {otpEnviado && (
                                <>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        className={styles.inputOTP}
                                        placeholder="Código OTP"
                                        value={codigoOTP}
                                        onChange={(e) => setCodigoOTP(e.target.value)}
                                    />

                                    <button className={styles.btnConfirmar} onClick={confirmarOTP}>
                                        Confirmar
                                    </button>
                                </>
                            )}

                            <button
                                className={styles.btnCancelar}
                                onClick={() => {
                                    setCodigoOTP("");
                                    setOtpEnviado(false);
                                    setMostrarModalOTP(false);
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL MOVIMIENTOS */}
                {mostrarModalMovimientos && (
                    <div className={styles.overlay}>
                        <div className={styles.modalMovimientos}>
                            <h3>Movimientos de la tarjeta</h3>

                            <select
                                className={styles.selectFiltroMov}
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="Todos">No filtrar</option>
                                <option value="Compra">Compra</option>
                                <option value="Pago">Pago</option>
                            </select>

                            <div className={styles.listaMovimientos}>
                                {movimientos
                                    .filter(m => filtro === "Todos" || m.tipo === filtro)
                                    .map(m => (
                                        <div className={styles.movimientoItem} key={m.id}>
                                            <p className={styles.movFecha}>
                                                {new Date(m.fecha).toLocaleDateString("es-CR")}
                                            </p>

                                            <p className={styles.movDescripcion}>
                                                {m.descripcion} <br />
                                                {m.monto}{m.moneda}
                                            </p>

                                            <span className={`${styles.movTipo} ${
                                                m.tipo === "Compra"
                                                    ? styles.compra
                                                    : styles.pago
                                            }`}>
                                                {m.tipo}
                                            </span>
                                        </div>
                                    ))}

                                {movimientos.length === 0 && (
                                    <p className={styles.sinMovimientos}>No hay movimientos registrados.</p>
                                )}
                            </div>

                            <button
                                className={styles.btnCerrarMov}
                                onClick={() => setMostrarModalMovimientos(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

                {/* MODAL DATOS SENSIBLES */}
                {mostrarModalDatos && (
                    <div className={styles.overlay}>
                        <div className={styles.modalDatos}>
                            <h3>Datos Sensibles de la Tarjeta</h3>

                            <p className={styles.subtitulo}>
                                Este código desaparecerá en <b>{contador}</b> segundos
                            </p>

                            <div className={styles.datosBox}>
                                <p><b>CVV:</b> {datosSensibles?.cvv}</p>
                                <p><b>PIN:</b> {datosSensibles?.pin}</p>
                            </div>

                            <button
                                className={styles.btnCerrarMov}
                                onClick={() => setMostrarModalDatos(false)}
                            >
                                Cerrar ahora
                            </button>
                        </div>
                    </div>
                )}

            </section>
        </section>
    );
}

export default Tarjetas;
