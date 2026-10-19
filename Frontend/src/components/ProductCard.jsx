import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.svg";
import { formatPrice } from "../utils/formatters";
import "../styles/components.css";

const ProductCard = ({ producto }) => (
  <article className="product-card">
    <img
      src={producto.imagen || placeholder}
      alt={`Foto del producto ${producto.nombre}`}
      className="product-card__image"
    />
    <div className="product-card__body">
      <h3 className="product-card__title">{producto.nombre}</h3>
      <p className="product-card__price">{formatPrice(producto.precio)}</p>
      <Link to={`/productos/${producto.id}`} className="btn btn--primary product-card__link">
        Ver más
      </Link>
    </div>
  </article>
);

export default ProductCard;
