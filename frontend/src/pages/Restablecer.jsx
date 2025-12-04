import { useState } from "react";
import styles from '../styles/Restablecer.module.css'
import logo from '../assets/Damena-logo-original.png'
import { useNavigate } from "react-router-dom";
import { restablecerContrasena } from "../../ConnectionAPI/apiFunciones";

function Restablecer(){
    const navigate = useNavigate();

    const [contrasenia, setContrasenia] = useState("");
    const [copiaContra, setCopiaContra] = useState("");
    const [mostrar, setMostrar] = useState(false);

    // errores visuales
    const [errorContrasenia, setErrorContrasenia] = useState("");
    const [errorConfirmacion, setErrorConfirmacion] = useState("");

    const handleValidarContra = async () =>{
        let valido = true;

        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(contrasenia)){
            setErrorContrasenia("Debe tener 8 caracteres, mayúscula, minúscula y un dígito.");
            valido = false;
        } else {
            setErrorContrasenia("");
        }

        if(copiaContra !== contrasenia){
            setErrorConfirmacion("Las contraseñas no coinciden.");
            valido = false;
        } else {
            setErrorConfirmacion("");
        }

        if(valido){
            const otpHash = localStorage.getItem("codigoHash");
            const id = localStorage.getItem("id");
            const restablecer = await restablecerContrasena(id, otpHash, contrasenia);
            navigate("/");
        }
    };

    return(
        <div className={styles.fondo}>
            <div className={styles.card}>

                <img className={styles.logoDamena} src={logo} />

                <h2 className={styles.tituloRestablecer}>Restablecer contraseña</h2>

                <label className={styles.label}>Nueva contraseña</label>
                <input 
                    className={styles.input}
                    type={mostrar ? "text" : "password"}
                    value={contrasenia}
                    onChange={(e) => { 
                        setContrasenia(e.target.value);
                        setErrorContrasenia("");
                    }}
                />

                {errorContrasenia && <p className={styles.error}>{errorContrasenia}</p>}

                <label className={styles.label}>Confirmar contraseña</label>
                <input 
                    className={styles.input}
                    type={mostrar ? "text" : "password"}
                    value={copiaContra}
                    onChange={(e) => { 
                        setCopiaContra(e.target.value);
                        setErrorConfirmacion("");
                    }}
                />

                {errorConfirmacion && <p className={styles.error}>{errorConfirmacion}</p>}

                <button 
                    className={styles.btnSecundario}
                    onClick={() => setMostrar(!mostrar)}
                >
                    {mostrar ? "Ocultar" : "Mostrar"}
                </button>

                <button 
                    className={styles.btnPrimario}
                    onClick={handleValidarContra}
                >
                    Confirmar
                </button>

            </div>
        </div>
    );
}

export default Restablecer;
