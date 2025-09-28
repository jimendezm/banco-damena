import { useState } from "react";
import logo from '../assets/Damena-logo-original.png'
import styles from './Login.module.css';
import { Link } from "react-router-dom";

function Login(){
    return(
        <div className={styles.contenedorPaginaLogin}>
            <section className={styles.contenedorSeccionLogin}>
                <img className={styles.logoDamenaLogin}  src={logo} alt="Imagen del logo de banco Damena en su versión clara" />
                <h2 className={styles.tituloSeccionLogin}>Iniciar sesion</h2>
                <form action="" className={styles.contenedorCredenciales}>
                    <label className={styles.labelSeccionLogin} htmlFor="">Usuario</label>
                    <input className={styles.inputUsuario} type="text" placeholder='Ejm: Usuario123'/>
                    <label className={styles.labelSeccionLogin} htmlFor="">Contraseña</label>
                    <input className={styles.inputPassword} type="password" />
                    <button className={styles.botonIniciarSesion}>Iniciar sesión</button>
                </form>
                <p className={styles.textoSeccionLogin}>En banco Damena sabemos que una de las cosas más importantes para ti es tu seguridad. Por eso, contamos con los más altos estándares en este ámbito y con profesionales especializados. Porque nosotros cuidamos lo tuyo.</p>
                <div className={styles.divisionAyuda}>
                    <Link to={'/recuperacion'}>Olvide mi contraseña</Link>
                </div>
            </section>
        </div>
    );
}
export default Login;