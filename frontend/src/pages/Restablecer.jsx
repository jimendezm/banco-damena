import { useState } from "react";
import './Restablecer.css'
import logo from '../assets/Damena-logo-original.png'
function Restablecer(){
    return(
        <div id="contenedorPagina">
            <img src={logo} alt="Logo de banco damena en su versión clara" id="logoDamena"/>
            <h2>Confirme su contraseña</h2>
            <section id="contenedorRestablecerContraseña">
                <label htmlFor="" id="labelContraseña">Agregue aquí su nueva contraseña</label>
                <input type="password" id="inputContraseña"/>
                <label htmlFor="" id="labelConfirmarContraseña">Porfavor confirme su contraseñas</label>
                <input type="password" id="inputConfirmarContraseña"/>
                <button id="botonMostrarContraseña">Mostrar Contrseñas</button>
                <button id="botonConfirmarContraseña">Confirmar contrseña</button>
            </section>
        </div>
    );
}

export default Restablecer;