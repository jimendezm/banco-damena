import './Login.css'
function Login(){
    return(
        <section id='contenedorSeccion'>
            <form action="" id="contenedorCredenciales">
                <label htmlFor="">Usuario</label>
                <input type="text" />
                <label htmlFor="">Contraseña</label>
                <input type="password" />
                <button id='botonIniciarSesion'>Iniciar sesión</button>
            </form>
            <a href="">Olvidé mi contraseña</a> <p>|</p> <a href="">Ayuda</a>
        </section>

    );
}
export default Login;