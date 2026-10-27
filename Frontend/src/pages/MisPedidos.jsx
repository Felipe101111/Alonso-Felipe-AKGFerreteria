import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Badge from "../components/Badge";
import Button from "../components/Button";
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

  const cargarPedidos = useCallback(async () => {
    try {
      const data = await pedidoService.getByCliente(usuario?.id);
      setPedidos(data ?? []);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [usuario, showToast]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const handleCancelar = async (pedido) => {
    try {
      await pedidoService.cancelar(pedido.id);
      showToast(`Pedido #${pedido.id} cancelado.`, "success");
      cargarPedidos();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

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
              <ul>
                {pedido.detalles?.map((detalle) => (
                  <li key={detalle.id}>
                    {detalle.cantidad} x {detalle.productoNombre} — {formatPrice(detalle.subtotal)}
                  </li>
                ))}
              </ul>
              <p className="pedidos__item-total">Total: {formatPrice(pedido.total)}</p>
              {pedido.estado === "pendiente" && (
                <Button variant="danger" onClick={() => handleCancelar(pedido)}>
                  Cancelar pedido
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default MisPedidos;
