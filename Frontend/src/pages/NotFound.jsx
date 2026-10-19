import { Link } from "react-router-dom";
import "../styles/global.css";

const NotFound = () => (
  <main className="not-found">
    <h1 className="section-title">404</h1>
    <p>La página que buscás no existe.</p>
    <Link to="/" className="btn btn--primary">
      Volver al inicio
    </Link>
  </main>
);

export default NotFound;
