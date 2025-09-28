import { useState } from "react";
import logo from '../assets/Damena-logo-original.png'
import styles from '../styles/Login.module.css';
import { Link } from "react-router-dom";
import clientes from "../assets/informacion/informacionUsuarios.json"; 
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [contrasenia, setContrasenia] = useState("");


    const handleLogin = (e) => {
        e.preventDefault();
        const clienteValido = clientes.find(
            (c) => c.nombreUsuario === usuario && c.contrasenia === contrasenia
        );
        if(clienteValido){
            const id = encodeURIComponent(clienteValido.customer_id);
            console.log("Navegando a Tarjetas con id:", clienteValido.customer_id, "encoded:", id);
            navigate(`/Tarjetas/${id}`)
        } else{
            alert("Usuario o contrasenia incorrectos");
        }
    }

    return(
        <div className={styles.contenedorPaginaLogin}>
            <section className={styles.contenedorSeccionLogin}>
                <img className={styles.logoDamenaLogin}  src={logo} alt="Imagen del logo de banco Damena en su versión clara" />
                <h2 className={styles.tituloSeccionLogin}>Iniciar sesion</h2>
                <form action="" className={styles.contenedorCredenciales}>
                    <label className={styles.labelSeccionLogin} htmlFor="">Usuario</label>
                    <input className={styles.inputUsuario} 
                    type="text" 
                    placeholder='Ejm: Usuario123'
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    />
                    <label className={styles.labelSeccionLogin} htmlFor="">Contraseña</label>
                    <input className={styles.inputPassword} 
                    type="password" 
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    />
                    <button className={styles.botonIniciarSesion}
                    type="submit"
                    onClick={handleLogin}
                    >Iniciar sesión</button>
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