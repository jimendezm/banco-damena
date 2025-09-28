import clientes from "../assets/informacion/informacionUsuarios.json";
import { useState, useEffect } from "react";
import styles from "../styles/Tarjetas.module.css";
import { useParams, useNavigate } from "react-router-dom";

function Tarjetas() {
    const { idUsuario } = useParams();

    const navigate = useNavigate();

    const cliente = clientes.find((c) => c.customer_id === idUsuario);

    const [indice, setIndice] = useState(0);

    useEffect(() => {
        if (!cliente) {
            alert("Cliente no encontrado. Volviendo al login.");
            navigate("/", { replace: true });
        }
    }, [cliente, navigate]);

    if (!cliente) return null;

    const tarjetas = cliente?.tarjetas ?? [];

    const siguiente = () => {
        if (tarjetas.length === 0) return;
        setIndice((prev) => (prev + 1) % tarjetas.length);
    };

    const anterior = () => {
        if (tarjetas.length === 0) return;
        setIndice((prev) => (prev - 1 + tarjetas.length) % tarjetas.length);
    };

    return (
        <div className={styles.contenedorSeccion}>
            <section className={styles.seccionTarjetas}>
                <button onClick={anterior}>{"<"}</button>

                <div className={styles.tarjeta}>
                    <h3>{tarjetas[indice].tipo} Card</h3>
                    <p><b>Número:</b> {tarjetas[indice].numero}</p>
                    <p><b>Exp:</b> {tarjetas[indice].exp}</p>
                    <p><b>Titular:</b> {tarjetas[indice].titular}</p>
                    <p><b>Saldo:</b> {tarjetas[indice].saldo} {tarjetas[indice].moneda}</p>
                </div>

                <button onClick={siguiente}>{">"}</button>
            </section>
        </div>
    );
}

export default Tarjetas;