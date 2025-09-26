import './Login.css'
import logo from '../assets/Damena-logo-original.png'

function Login(){
    return(
        <div id='contenedorPagina'>
            <section id='contenedorSeccion'>
                <img id='logoDamena' src={logo} alt="Imagen del logo de banco Damena en su versión clara" />
                <h2>Log in</h2>
                <form action="" id="contenedorCredenciales">
                    <label htmlFor="">Usuario</label>
                    <input type="text" placeholder='Ejm: Usuario123'/>
                    <label htmlFor="">Contraseña</label>
                    <input type="password" />
                    <button id='botonIniciarSesion'>Iniciar sesión</button>
                </form>
                <p>En banco Damena sabemos que una de las cosas más importantes para ti es tu seguridad. Por eso, contamos con los más altos estándares en este ámbito y con profesionales especializados. Porque nosotros cuidamos lo tuyo.</p>
                <div id='divisionAyuda'>
                    <a href="">Olvidé mi contraseña</a>  <a href="">Ayuda</a>
                </div>
            </section>
        </div>
    );
}
export default Login;