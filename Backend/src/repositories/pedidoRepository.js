import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";

const pedidos = [];
const detalles = [];
let nextPedidoId = 1;
let nextDetalleId = 1;

const conDetalles = (pedido) => ({
  ...pedido,
  detalles: detalles.filter((d) => d.pedidoId === pedido.id),
});

const findAll = () => [...pedidos].reverse().map(conDetalles);

const findById = (id) => {
  const pedido = pedidos.find((p) => p.id === Number(id));
  return pedido ? conDetalles(pedido) : null;
};

const findByCliente = (clienteId) =>
  pedidos
    .filter((p) => p.clienteId === Number(clienteId))
    .reverse()
    .map(conDetalles);

const create = ({ clienteId, total, items }) => {
  const pedido = new Pedido(nextPedidoId++, new Date().toISOString(), "pendiente", total, clienteId);
  pedidos.push(pedido);
  items.forEach((item) => {
    detalles.push(
      new DetallePedido(
        nextDetalleId++,
        item.cantidad,
        item.precioUnitario,
        item.subtotal,
        pedido.id,
        item.productoId,
        item.productoNombre,
      ),
    );
  });
  return conDetalles(pedido);
};

const updateEstado = (id, estado) => {
  const pedido = pedidos.find((p) => p.id === Number(id));
  if (!pedido) return null;
  pedido.estado = estado;
  return conDetalles(pedido);
};

export default { findAll, findById, findByCliente, create, updateEstado };
