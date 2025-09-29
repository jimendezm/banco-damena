import { useState, useEffect } from "react";
import logo from '../assets/Damena-logo-original.png'
import styles from '../styles/Login.module.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { initializeSampleData, verificarCredenciales} from '../services/userService';

function Login(){
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    useEffect(() => {
        initializeSampleData();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const idUsuario = verificarCredenciales(usuario, contrasenia)
        if( idUsuario != null){
            // Guardar usuario en sessionStorage
            const usersData = JSON.parse(localStorage.getItem('bank_users') || '{"users":[]}');
            const user = usersData.users.find(u => u.id === idUsuario);
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            navigate(`/dashboard/${idUsuario}`);
        } else{
            alert("Usuario o contraseña incorrectos");
        }
    };

    return(
        <div className={styles.contenedorPaginaLogin}>
            <section className={styles.contenedorSeccionLogin}>
                <img className={styles.logoDamenaLogin}  src={logo} alt="Imagen del logo de banco Damena en su versión clara" />
                <h2 className={styles.tituloSeccionLogin}>Iniciar sesión</h2>
                <form action="" className={styles.contenedorCredenciales}>
                    <label className={styles.labelSeccionLogin} htmlFor="">Usuario</label>
                    <input className={styles.inputUsuario} 
                    type="text" 
                    placeholder='Ejemplo: usuario123'
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
                    <Link to={'/recuperacion'}>Olvidé mi contraseña</Link>
                    <Link to={'/registro'}>¡Registrate!</Link>
                </div>
            </section>
        </div>
    );
}
export default Login;