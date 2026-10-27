import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import pedidoService from "../services/pedidoService";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/formatters";
import "../styles/pedidos.css";

const Carrito = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);

  const confirmarCompra = async () => {
    setEnviando(true);
    try {
      await pedidoService.create({
        detalles: items.map(({ productoId, cantidad }) => ({ productoId, cantidad })),
      });
      clearCart();
      showToast("Pedido confirmado con éxito.", "success");
      navigate("/mis-pedidos");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="pedidos">
      <h1 className="section-title">Mi Carrito</h1>
      {items.length === 0 ? (
        <p className="pedidos__vacio">
          Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
        </p>
      ) : (
        <>
          <ul className="pedidos__lista">
            {items.map((item) => (
              <li key={item.productoId} className="pedidos__item">
                <div className="pedidos__item-header">
                  <span className="pedidos__item-id">{item.nombre}</span>
                  <span>{formatPrice(item.precio)} c/u</span>
                </div>
                <div className="form-field">
                  <label htmlFor={`cantidad-${item.productoId}`} className="form-field__label">
                    Cantidad (máx. {item.stock})
                  </label>
                  <input
                    id={`cantidad-${item.productoId}`}
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.cantidad}
                    className="form-field__input"
                    onChange={(event) => updateQuantity(item.productoId, Number(event.target.value) || 1)}
                  />
                </div>
                <p className="pedidos__item-total">Subtotal: {formatPrice(item.precio * item.cantidad)}</p>
                <Button variant="danger" onClick={() => removeItem(item.productoId)}>
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
          <p className="pedidos__item-total">Total: {formatPrice(total)}</p>
          <Button variant="primary" onClick={confirmarCompra} disabled={enviando}>
            {enviando ? "Procesando..." : "Confirmar compra"}
          </Button>
        </>
      )}
    </main>
  );
};

export default Carrito;
