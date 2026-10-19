import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const linkClassName = ({ isActive }) => `navbar__link${isActive ? " navbar__link--active" : ""}`;

const Navbar = () => {
  const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <nav className="navbar__nav" aria-label="Navegación principal">
        <Link to="/" className="navbar__brand">
          AKG-FERRETERÍA
        </Link>
        <ul className="navbar__links">
          <li>
            <NavLink to="/productos" className={linkClassName}>
              Productos
            </NavLink>
          </li>
          <li>
            <a href="/#sobre-nosotros" className="navbar__link">
              Nosotros
            </a>
          </li>
          <li>
            <a href="/#contacto" className="navbar__link">
              Contacto
            </a>
          </li>
          {isAuthenticated && !isAdmin && (
            <li>
              <NavLink to="/mis-pedidos" className={linkClassName}>
                Mis Pedidos
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={linkClassName}>
                Panel Admin
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <li>
              <button type="button" className="navbar__link navbar__logout" onClick={handleLogout}>
                Salir ({usuario?.nombre})
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login" className={linkClassName}>
                Ingresar
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
