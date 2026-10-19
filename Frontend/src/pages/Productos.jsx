import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Input from "../components/Input";
import productService from "../services/productService";
import categoriaService from "../services/categoriaService";
import { useToast } from "../context/ToastContext";
import "../styles/productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          productService.getAll(),
          categoriaService.getAll().catch(() => []),
        ]);
        if (!activo) return;

        setProductos(productosData ?? []);
        const categoriasDerivadas = categoriasData?.length
          ? categoriasData
          : Array.from(new Set((productosData ?? []).map((producto) => producto.categoria).filter(Boolean)));
        setCategorias(categoriasDerivadas);
      } catch (error) {
        if (activo) showToast(error.message, "error");
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarDatos();
    return () => {
      activo = false;
    };
  }, [showToast]);

  const productosFiltrados = useMemo(
    () =>
      productos.filter((producto) => {
        const coincideBusqueda = producto.nombre?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSeleccionada === "todas" || producto.categoria === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
      }),
    [productos, busqueda, categoriaSeleccionada],
  );

  return (
    <main className="catalogo">
      <h1 className="section-title">Nuestros Productos</h1>

      <div className="catalogo__filtros">
        <Input
          id="busqueda-producto"
          label="Buscar producto"
          type="search"
          placeholder="Ej: martillo, cable, pintura..."
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
        />
        <div className="form-field">
          <label htmlFor="categoria-filtro" className="form-field__label">
            Categoría
          </label>
          <select
            id="categoria-filtro"
            className="form-field__input"
            value={categoriaSeleccionada}
            onChange={(event) => setCategoriaSeleccionada(event.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Cargando catálogo..." />
      ) : productosFiltrados.length === 0 ? (
        <p className="catalogo__vacio">No se encontraron productos con esos criterios.</p>
      ) : (
        <div className="catalogo__grid">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Productos;
