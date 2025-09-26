import { useState } from "react";
import './Recuperacion.css'
import logo from '../assets/Damena-logo-original.png'
function Recuperacion(){
    return(
        <div id="contenedor">
            <img id="logoDamena" src={logo} alt="" />
            <h2>Recuperacion contraseña</h2>
            <section id="seccionRecuperacion">
                <label htmlFor="" id="labelCorreo">Introduzca su correo electrónico</label>
                <input id="textoEmailUsuario" type="text" />
                <button id="botonEnviarCodigo">Enviar codigo</button>
                <label htmlFor="" id="labelRecuperacion">Ingrese el codigo de recuperacion</label>
                <input id="textoCodigo" type="text" />
                <button id="botonValidacion">Validar codigo</button>
            </section>
        </div>
    );
}
export default Recuperacion;