import { useState } from "react";
import styles from './Restablecer.module.css'
import logo from '../assets/Damena-logo-original.png'
import { useNavigate } from "react-router-dom";

function Restablecer(){
    const navigate = useNavigate();
    const [contrasenia, setContrasenia] = useState("");
    const [copiaContra, setCopiaContra] = useState("");
    const [mostrar, setMostrar] = useState(false);

    const handleValidarContra = () =>{
        if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(contrasenia) && copiaContra === contrasenia){
            window.alert("Redirigiendo");
            navigate("/");
        }else{
            window.alert("Porfavor cree una contrasenia con 8 caracteres de longitud, almenos una minuscula y una mayuscula, y almenos un digito. Ademas las contrasenias deben ser iguales")
        }
    }

    return(
        <div className={styles.contenedorPaginaRestablecer} id="contenedorPaginaRestablecer">
            <img className= {styles.logoDamena} src={logo} alt="Logo de banco damena en su versión clara" />
            <h2 className= {styles.tituloRestablecer}>Confirme su contraseña</h2>
            <section className={styles.contenedorRestablecerContraseña} id="contenedorRestablecerContraseña">
                <label className={styles.labelContraseña} htmlFor="" id="labelContraseña">Agregue aquí su nueva contraseña</label>
                <input 
                className={styles.inputContraseña} 
                type={mostrar ? "text" : "password"}
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                />
                <label className={styles.labelConfirmarContraseña} htmlFor="" id="labelConfirmarContraseña">Porfavor confirme su contraseñas</label>
                
                <input 
                className={styles.inputConfirmarContraseña} 
                type={mostrar ? "text" : "password"}
                value={copiaContra}
                onChange={(e) => setCopiaContra(e.target.value)}
                />
                
                <button 
                className={styles.botonMostrarContraseña}
                onClick={() => setMostrar(!mostrar)}
                
                >Mostrar Contrseñas</button>
                
                <button 
                className={styles.botonConfirmarContraseña}
                onClick={handleValidarContra}
                >Confirmar contrseña</button>
            </section>
        </div>
    );
}

export default Restablecer;