import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import productService from "../services/productService";
import { useToast } from "../context/ToastContext";
import heroImage from "../assets/hero-local.png";
import "../styles/home.css";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let activo = true;

    const cargarDestacados = async () => {
      try {
        const data = await productService.getAll();
        if (activo) setProductos((data ?? []).slice(0, 3));
      } catch (error) {
        if (activo) showToast(error.message, "error");
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarDestacados();
    return () => {
      activo = false;
    };
  }, [showToast]);

  return (
    <main className="home">
      <section className="hero">
        <img src={heroImage} alt="Fachada del local de AKG Ferretería" className="hero__image" />
        <div className="hero__content">
          <p className="hero__eyebrow">Bienvenidos a</p>
          <h1 className="hero__title">AKG Ferretería</h1>
          <p className="hero__text">Herramientas y materiales para tu hogar y trabajo.</p>
          <a href="#contacto" className="btn btn--primary">
            Contactanos
          </a>
        </div>
      </section>

      <section id="sobre-nosotros" className="about">
        <h2 className="section-title">Sobre Nosotros</h2>
        <p className="about__text">
          AKG Ferretería es un local de barrio ubicado en el corazón de Buenos Aires. Hace años que ayudamos a
          vecinos, electricistas y pequeñas empresas a encontrar las herramientas y los materiales que necesitan
          para cada proyecto, desde la reparación más simple hasta la obra más exigente.
        </p>
        <p className="about__text">
          Nos especializamos en herramientas manuales, insumos eléctricos y artículos del hogar, con atención
          personalizada y el conocimiento de quien conoce el oficio. En AKG no sos un número: te asesoramos, te
          ayudamos a elegir y nos aseguramos de que te vayas con lo que realmente necesitás.
        </p>
        <p className="about__quote">Porque cada reparación importa, y vos merecés la herramienta correcta.</p>
      </section>

      <section className="featured">
        <h2 className="section-title">Productos Estrella</h2>
        {loading ? (
          <Loader label="Cargando productos destacados..." />
        ) : (
          <div className="featured__grid">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
        <div className="featured__cta">
          <Link to="/productos" className="btn btn--secondary">
            Ver todos los productos
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
