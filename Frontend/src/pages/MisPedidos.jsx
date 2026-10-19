import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Badge from "../components/Badge";
import pedidoService from "../services/pedidoService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDate, formatPrice } from "../utils/formatters";
import "../styles/pedidos.css";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let activo = true;

    const cargarPedidos = async () => {
      try {
        const data = await pedidoService.getByCliente(usuario?.id);
        if (activo) setPedidos(data ?? []);
      } catch (error) {
        if (activo) showToast(error.message, "error");
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarPedidos();
    return () => {
      activo = false;
    };
  }, [usuario, showToast]);

  if (loading) return <Loader label="Cargando tus pedidos..." />;

  return (
    <main className="pedidos">
      <h1 className="section-title">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="pedidos__vacio">Todavía no realizaste ningún pedido.</p>
      ) : (
        <ul className="pedidos__lista">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="pedidos__item">
              <div className="pedidos__item-header">
                <span className="pedidos__item-id">Pedido #{pedido.id}</span>
                <Badge estado={pedido.estado} />
              </div>
              <p className="pedidos__item-fecha">{formatDate(pedido.fecha)}</p>
              <p className="pedidos__item-total">Total: {formatPrice(pedido.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default MisPedidos;
