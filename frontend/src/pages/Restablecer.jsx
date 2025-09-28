import { useState } from "react";
import styles from './Restablecer.module.css'
import logo from '../assets/Damena-logo-original.png'
function Restablecer(){
    return(
        <div className={styles.contenedorPaginaRestablecer} id="contenedorPaginaRestablecer">
            <img className= {styles.logoDamena} src={logo} alt="Logo de banco damena en su versión clara" />
            <h2 className= {styles.tituloRestablecer}>Confirme su contraseña</h2>
            <section className={styles.contenedorRestablecerContraseña} id="contenedorRestablecerContraseña">
                <label className={styles.labelContraseña} htmlFor="" id="labelContraseña">Agregue aquí su nueva contraseña</label>
                <input className={styles.inputContraseña} type="password" id="inputContraseña"/>
                <label className={styles.labelConfirmarContraseña} htmlFor="" id="labelConfirmarContraseña">Porfavor confirme su contraseñas</label>
                <input className={styles.inputConfirmarContraseña} type="password" id="inputConfirmarContraseña"/>
                <button className={styles.botonMostrarContraseña} id="botonMostrarContraseña">Mostrar Contrseñas</button>
                <button className={styles.botonConfirmarContraseña} id="botonConfirmarContraseña">Confirmar contrseña</button>
            </section>
        </div>
    );
}

export default Restablecer;