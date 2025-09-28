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
    const coloresTarjeta = {
        Gold: "#FFD700",
        Platinum: "#E5E4E2",
        Black: "#1C1C1C"
    };

    return (
        <div className={styles.contenedorSeccion}
        style={{
            background: `linear-gradient(145deg, ${coloresTarjeta[tarjetas[indice].tipo]}80, white)`,
            color: tarjetas[indice].tipo === "Black" ? "white" : "black"
        }}
        >
            <section className={styles.seccionTarjetas}>
                <button onClick={anterior}>{"<"}</button>
                    <div 
                    key={tarjetas[indice].card_id}
                    className={styles.tarjeta}
                    style={{
                        background: `linear-gradient(135deg, ${coloresTarjeta[tarjetas[indice].tipo]}80, ${coloresTarjeta[tarjetas[indice].tipo]})`,
                        color: tarjetas[indice].tipo === "Black" ? "white" : "black"
                    }}
                    >
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