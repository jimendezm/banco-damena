import { useState } from "react";
import styles from '../styles/Recuperacion.module.css'
import logo from '../assets/Damena-logo-original.png'
import { useNavigate } from "react-router-dom";

function Recuperacion(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const [codigo,setCodigo] = useState("")

    const[codigoEnviado, setCodigoEnviado] = useState(false);

    const handleEnviarCodigo = () => {
        setCodigoEnviado(true);
    };

    const  handleValidarCodigo = () => {
        if(/^\d{6}$/.test(codigo)){
            window.alert("codigo correctto");
            navigate("/restablecer");
        } else {
            window.alert("El codigo debe de tener 6 digitos")
        }
    };
    const validarEmail = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    };

    return(
        <div className={styles.contenedor} id="contenedor">
            
            <img className={styles.logoDamena}  src={logo} alt="" />
            
            <h2 className={styles.tituloRecuperacion}>Recuperacion contraseña</h2>
            
            <section className={styles.seccionRecuperacion} id="seccionRecuperacion">
                
                <label className={styles.labelCorreo} htmlFor="" id="labelCorreo">Introduzca su correo electrónico</label>

                <input className={styles.inputEmailUsuario}  type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <button className={styles.botonEnviarCodigo} onClick={handleEnviarCodigo} disabled = {!validarEmail(email) || codigoEnviado} id="botonEnviarCodigo">Enviar codigo</button>
                
                <label className={styles.labelRecuperacion} htmlFor="" id="labelRecuperacion">Ingrese el codigo de recuperacion</label>
                
                <input className={styles.inputCodigo} disabled = {!codigoEnviado} value={codigo} onChange={(e) => setCodigo(e.target.value)} id="textoCodigo" type="number" />
                
                <button  className={styles.botonValidacion} onClick={handleValidarCodigo} disabled = {!codigoEnviado} id="botonValidacion">Validar codigo</button>
            
            </section>
        
        </div>
    );
}
export default Recuperacion;