import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Button from "../components/Button";
import productService from "../services/productService";
import pedidoService from "../services/pedidoService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/formatters";
import placeholder from "../assets/placeholder.svg";
import "../styles/productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarProducto = async () => {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        if (activo) setProducto(data);
      } catch (error) {
        if (activo) showToast(error.message, "error");
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarProducto();
    return () => {
      activo = false;
    };
  }, [id, showToast]);

  const handleAgregarAlCarrito = () => {
    if (!isAuthenticated) {
      showToast("Iniciá sesión para agregar productos al carrito.", "info");
      navigate("/login");
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) {
      showToast(`Ingresá una cantidad entre 1 y ${producto.stock}.`, "error");
      return;
    }
    const guardada = addItem(producto, cantidad);
    showToast(`Carrito actualizado: ${guardada} x ${producto.nombre}.`, "success");
  };

  const handlePedido = async () => {
    if (!isAuthenticated) {
      showToast("Iniciá sesión para realizar un pedido.", "info");
      navigate("/login");
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) {
      showToast(`Ingresá una cantidad entre 1 y ${producto.stock}.`, "error");
      return;
    }

    setEnviando(true);
    try {
      await pedidoService.create({
        detalles: [{ productoId: producto.id, cantidad }],
      });
      showToast("Pedido realizado con éxito.", "success");
      navigate("/mis-pedidos");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <Loader label="Cargando producto..." />;
  if (!producto) return <p className="catalogo__vacio">Producto no encontrado.</p>;

  return (
    <main className="product-detail">
      <img
        src={producto.imagen || placeholder}
        alt={`Foto del producto ${producto.nombre}`}
        className="product-detail__image"
      />
      <div className="product-detail__info">
        <h1 className="product-detail__title">{producto.nombre}</h1>
        <p className="product-detail__category">{producto.categoria}</p>
        <p className="product-detail__price">{formatPrice(producto.precio)}</p>
        <p className="product-detail__description">{producto.descripcion}</p>
        <p className="product-detail__stock">Stock disponible: {producto.stock}</p>

        <div className="form-field product-detail__cantidad">
          <label htmlFor="cantidad" className="form-field__label">
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            min="1"
            max={producto.stock || 1}
            value={cantidad}
            className="form-field__input"
            onChange={(event) => setCantidad(Number(event.target.value))}
          />
        </div>

        {!isAdmin && (
          <div className="product-detail__acciones">
            <Button variant="secondary" onClick={handleAgregarAlCarrito} disabled={producto.stock === 0}>
              Agregar al carrito
            </Button>
            <Button variant="primary" onClick={handlePedido} disabled={enviando || producto.stock === 0}>
              {producto.stock === 0 ? "Sin stock" : enviando ? "Procesando..." : "Comprar ahora"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
