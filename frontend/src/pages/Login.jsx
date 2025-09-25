import './Login.css'
import logo from '../assets/Damena-logo-original.png'

function Login(){
    return(
        <section id='contenedorSeccion'>
            <img id='logoDamena' src={logo} alt="Imagen del logo de banco Damena en su versión clara" />
            <form action="" id="contenedorCredenciales">
                <label htmlFor="">Usuario</label>
                <input type="text" />
                <label htmlFor="">Contraseña</label>
                <input type="password" />
                <button id='botonIniciarSesion'>Iniciar sesión</button>
            </form>
            <div id='divisionAyuda'>
                <a href="">Olvidé mi contraseña</a> <p>|</p> <a href="">Ayuda</a>
            </div>
        </section>

    );
}
export default Login;