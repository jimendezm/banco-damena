import { useState } from "react";
import styles from '../styles/Recuperacion.module.css'
import logo from '../assets/Damena-logo-original.png'
import { useNavigate } from "react-router-dom";
import { obtenerCodigoRecuperacion } from "../../ConnectionAPI/apiFunciones";
function Recuperacion(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [campoEmailActivo, setCampoEmailActivo] = useState(true);

    // Estados de error
    const [errorEmail, setErrorEmail] = useState("");
    const [errorCodigo, setErrorCodigo] = useState("");

    const validarEmail = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    };

    const handleEnviarCodigo = async () => {
        setCampoEmailActivo(false);
        if (!validarEmail(email)) {
            setErrorEmail("Ingrese un correo válido.");
            return;
        }
        setErrorEmail("");
        setCodigoEnviado(true);
        const resultado = await obtenerCodigoRecuperacion(email);
        console.log("CódigoOTP: ", resultado.otp || "No se recibió código");

    };

    const handleValidarCodigo = () => {
        if (!/^\d{6}$/.test(codigo)) {
            setErrorCodigo("El código debe tener 6 dígitos.");
            return;
        }

        setErrorCodigo("");
        navigate("/restablecer");
    };

    return(
        <div className={styles.fondo}>
            <div className={styles.card}>
                
                <img className={styles.logo} src={logo} alt="" />

                <h2 className={styles.titulo}>Recuperación de contraseña</h2>

                <label className={styles.label}>Correo electrónico</label>
                <input 
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => { 
                        setEmail(e.target.value);
                        setErrorEmail("");
                    }}
                    disabled={!campoEmailActivo}
                />

                {errorEmail && <p className={styles.error}>{errorEmail}</p>}

                <button 
                    className={styles.btnPrimario}
                    onClick={handleEnviarCodigo}
                    disabled={!email || !campoEmailActivo}
                >
                    Enviar código
                </button>

                <label className={styles.label}>Código de verificación</label>
                <input 
                    className={styles.input}
                    type="number"
                    disabled={!codigoEnviado}
                    value={codigo}
                    onChange={(e) => { 
                        setCodigo(e.target.value);
                        setErrorCodigo("");
                    }}
                />

                {errorCodigo && <p className={styles.error}>{errorCodigo}</p>}

                <button 
                    className={styles.btnSecundario}
                    onClick={handleValidarCodigo}
                    disabled={!codigoEnviado}
                >
                    Validar código
                </button>

            </div>
        </div>
    );
}

export default Recuperacion;
