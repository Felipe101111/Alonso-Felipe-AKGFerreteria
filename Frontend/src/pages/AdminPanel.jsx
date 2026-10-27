import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import productService from "../services/productService";
import pedidoService from "../services/pedidoService";
import { useToast } from "../context/ToastContext";
import { formatDate, formatPrice } from "../utils/formatters";
import { isEmpty } from "../utils/validators";
import "../styles/admin.css";

const FORM_INICIAL = { nombre: "", descripcion: "", precio: "", stock: "", categoria: "" };
const ESTADOS_PEDIDO = ["pendiente", "en proceso", "enviado", "entregado", "cancelado"];

const AdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  const { showToast } = useToast();

  const cargarProductos = async () => {
    setLoadingProductos(true);
    try {
      const data = await productService.getAll();
      setProductos(data ?? []);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoadingProductos(false);
    }
  };

  const cargarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const data = await pedidoService.getAll();
      setPedidos(data ?? []);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarPedidos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (isEmpty(form.nombre)) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (isEmpty(form.precio) || Number(form.precio) < 0) nuevosErrores.precio = "Ingresá un precio válido.";
    if (isEmpty(form.stock) || Number(form.stock) < 0) nuevosErrores.stock = "Ingresá un stock válido.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setErrores({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validar()) return;

    setGuardando(true);
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoria,
    };

    try {
      if (editandoId) {
        await productService.update(editandoId, payload);
        showToast("Producto actualizado correctamente.", "success");
      } else {
        await productService.create(payload);
        showToast("Producto creado correctamente.", "success");
      }
      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre ?? "",
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? ""),
      categoria: producto.categoria ?? "",
    });
  };

  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await productService.remove(productoAEliminar.id);
      showToast("Producto eliminado correctamente.", "success");
      setProductoAEliminar(null);
      cargarProductos();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleCambiarEstado = async (pedido, nuevoEstado) => {
    if (nuevoEstado === pedido.estado) return;
    try {
      await pedidoService.cambiarEstado(pedido.id, nuevoEstado);
      showToast(`Pedido #${pedido.id} actualizado a "${nuevoEstado}".`, "success");
      cargarPedidos();
      // El stock puede haberse restituido (pedido cancelado), se refleja en la tabla de productos.
      cargarProductos();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <main className="admin">
      <h1 className="section-title">Panel de Administrador</h1>

      <form className="admin__form" onSubmit={handleSubmit} noValidate>
        <h2 className="admin__form-title">{editandoId ? "Editar producto" : "Nuevo producto"}</h2>
        <Input id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} />
        <Input
          id="descripcion"
          name="descripcion"
          label="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
        <Input
          id="precio"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          label="Precio"
          value={form.precio}
          onChange={handleChange}
          error={errores.precio}
        />
        <Input
          id="stock"
          name="stock"
          type="number"
          min="0"
          label="Stock"
          value={form.stock}
          onChange={handleChange}
          error={errores.stock}
        />
        <Input id="categoria" name="categoria" label="Categoría" value={form.categoria} onChange={handleChange} />
        <div className="admin__form-actions">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear producto"}
          </Button>
          {editandoId && (
            <Button type="button" variant="secondary" onClick={limpiarFormulario}>
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {loadingProductos ? (
        <Loader label="Cargando productos..." />
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <caption className="sr-only">Listado de productos</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{formatPrice(producto.precio)}</td>
                  <td>{producto.stock}</td>
                  <td className="admin__table-actions">
                    <Button variant="secondary" onClick={() => handleEditar(producto)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => setProductoAEliminar(producto)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="section-title admin__section-title">Gestión de Pedidos</h2>
      {loadingPedidos ? (
        <Loader label="Cargando pedidos..." />
      ) : pedidos.length === 0 ? (
        <p className="admin__vacio">No hay pedidos registrados.</p>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <caption className="sr-only">Listado de pedidos</caption>
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Cliente</th>
                <th scope="col">Productos</th>
                <th scope="col">Fecha</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.clienteNombre}</td>
                  <td>
                    <ul>
                      {pedido.detalles?.map((detalle) => (
                        <li key={detalle.id}>
                          {detalle.cantidad} x {detalle.productoNombre}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{formatDate(pedido.fecha)}</td>
                  <td>{formatPrice(pedido.total)}</td>
                  <td>
                    <Badge estado={pedido.estado} />
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`estado-${pedido.id}`}>
                      Cambiar estado del pedido {pedido.id}
                    </label>
                    <select
                      id={`estado-${pedido.id}`}
                      className="admin__estado-select"
                      value={pedido.estado}
                      onChange={(event) => handleCambiarEstado(pedido, event.target.value)}
                    >
                      {ESTADOS_PEDIDO.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={Boolean(productoAEliminar)}
        title="Eliminar producto"
        onClose={() => setProductoAEliminar(null)}
        onConfirm={confirmarEliminar}
        confirmLabel="Eliminar"
        danger
      >
        <p>¿Estás seguro de que querés eliminar &quot;{productoAEliminar?.nombre}&quot;? Esta acción no se puede deshacer.</p>
      </Modal>
    </main>
  );
};

export default AdminPanel;
