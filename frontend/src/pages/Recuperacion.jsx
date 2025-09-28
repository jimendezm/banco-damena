import { useState } from "react";
import styles from './Recuperacion.module.css'
import logo from '../assets/Damena-logo-original.png'
function Recuperacion(){
    return(
        <div className={styles.contenedor} id="contenedor">
            <img className={styles.logoDamena}  src={logo} alt="" />
            <h2 className={styles.tituloRecuperacion}>Recuperacion contraseña</h2>
            <section className={styles.seccionRecuperacion} id="seccionRecuperacion">
                <label className={styles.labelCorreo} htmlFor="" id="labelCorreo">Introduzca su correo electrónico</label>
                <input className={styles.inputEmailUsuario} id="textoEmailUsuario" type="text" />
                <button className={styles.botonEnviarCodigo} id="botonEnviarCodigo">Enviar codigo</button>
                <label className={styles.labelRecuperacion} htmlFor="" id="labelRecuperacion">Ingrese el codigo de recuperacion</label>
                <input className={styles.inputCodigo} id="textoCodigo" type="text" />
                <button className={styles.botonValidacion} id="botonValidacion">Validar codigo</button>
            </section>
        </div>
    );
}
export default Recuperacion;