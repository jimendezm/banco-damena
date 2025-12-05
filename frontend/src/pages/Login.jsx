import { useState, useEffect } from "react";
import logo from '../assets/Damena-logo-original.png'
import styles from '../styles/Login.module.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { initializeSampleData, verificarCredenciales} from '../services/userService';
import { IniciarSesion } from "../../ConnectionAPI/apiFunciones";
import Alert from '../components/Alert';

function Login(){
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("identificaion");
    }, []);
    
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'error',
        title: '',
        message: ''
    });

    const showAlert = (type, title, message) => {
        setAlertState({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    const toggleMostrarContrasenia = () => {
        setMostrarContrasenia(!mostrarContrasenia);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const dataLogin = await IniciarSesion(usuario, contrasenia);
        console.log("Esto es una prueba")
        if(dataLogin.status == "success"){
            localStorage.setItem("token", dataLogin.token);
            localStorage.setItem("userId", dataLogin.id);
            localStorage.setItem("loginTime", Date.now().toString());
            localStorage.setItem("identificacion", dataLogin.identificacion);
            localStorage.setItem("email", dataLogin.email);
            console.log("Token almacenado en localStorage:", dataLogin.token, "  identificacion: ", dataLogin.identificacion);
            navigate("/dashboard");
        }else{
            showAlert('error', 'Error de Inicio de Sesión', dataLogin.message || "Credenciales incorrectas");
        }
    };

    return(
        <div className={styles.contenedorPaginaLogin}>
            <Alert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
            />

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
                    <div className={styles.passwordContainer}>
                        <input className={styles.inputPassword} 
                        type={mostrarContrasenia ? "text" : "password"} 
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        />
                        <button 
                            type="button"
                            className={styles.passwordToggle}
                            onClick={toggleMostrarContrasenia}
                        >
                            {mostrarContrasenia ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 12C3 12 6.27273 5 12 5C17.7273 5 21 12 21 12C21 12 17.7273 19 12 19C6.27273 19 3 12 3 12Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 12C3 12 6.27273 5 12 5C17.7273 5 21 12 21 12C21 12 17.7273 19 12 19C6.27273 19 3 12 3 12Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M4 4L20 20" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            )}
                        </button>
                    </div>
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