import pedidoRepository from "../repositories/pedidoRepository.js";
import productoRepository from "../repositories/productoRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isPositiveInteger } from "../utils/validators.js";

export const ESTADOS = ["pendiente", "en proceso", "enviado", "entregado", "cancelado"];
const ESTADOS_FINALES = ["entregado", "cancelado"];

const getById = (id) => {
  const pedido = pedidoRepository.findById(id);
  if (!pedido) throw new NotFoundError(Messages.ORDER_NOT_FOUND);
  return pedido;
};

const getClienteDeUsuario = (usuarioId) => {
  const cliente = clienteRepository.findByUsuarioId(usuarioId);
  if (!cliente) throw new NotFoundError(Messages.CLIENT_NOT_FOUND);
  return cliente;
};

const restaurarStock = (pedido) => {
  pedido.detalles.forEach((detalle) => {
    const producto = productoRepository.findById(detalle.productoId);
    if (producto) {
      productoRepository.update(producto.id, { stock: producto.stock + detalle.cantidad });
    }
  });
};

const enriquecer = (pedido) => ({
  ...pedido,
  clienteNombre: clienteRepository.findById(pedido.clienteId)?.nombre ?? "Cliente desconocido",
  detalles: pedido.detalles.map((detalle) => ({
    ...detalle,
    productoNombre: detalle.productoNombre,
  })),
});

const getAll = () => pedidoRepository.findAll().map(enriquecer);

const getByCliente = (usuarioSolicitante, usuarioId) => {
  if (usuarioSolicitante.rol !== "admin" && usuarioSolicitante.id !== Number(usuarioId)) {
    throw new ForbiddenError(Messages.FORBIDDEN);
  }
  const cliente = getClienteDeUsuario(usuarioId);
  return pedidoRepository.findByCliente(cliente.id).map(enriquecer);
};

const create = (usuarioId, { detalles }) => {
  const cliente = clienteRepository.findByUsuarioId(usuarioId);
  if (!cliente) throw new ForbiddenError(Messages.FORBIDDEN);

  if (!Array.isArray(detalles) || detalles.length === 0) {
    throw new BadRequestError(Messages.EMPTY_ORDER);
  }

  // Agrupa líneas repetidas del mismo producto.
  const cantidades = new Map();
  detalles.forEach(({ productoId, cantidad }) => {
    if (!isPositiveInteger(cantidad)) throw new BadRequestError(Messages.INVALID_QUANTITY);
    const clave = Number(productoId);
    cantidades.set(clave, (cantidades.get(clave) ?? 0) + cantidad);
  });

  // Valida existencia y stock antes de modificar nada.
  const items = [...cantidades].map(([productoId, cantidad]) => {
    const producto = productoRepository.findById(productoId);
    if (!producto) throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
    if (cantidad > producto.stock) {
      throw new BadRequestError(`${Messages.INSUFFICIENT_STOCK} (${producto.nombre}: disponible ${producto.stock}).`);
    }
    return {
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cantidad,
    };
  });

  items.forEach((item) => {
    const producto = productoRepository.findById(item.productoId);
    productoRepository.update(producto.id, { stock: producto.stock - item.cantidad });
  });

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  return enriquecer(pedidoRepository.create({ clienteId: cliente.id, total, items }));
};

const cambiarEstado = (id, estado) => {
  if (!ESTADOS.includes(estado)) throw new BadRequestError(Messages.INVALID_ORDER_STATE);

  const pedido = getById(id);
  if (ESTADOS_FINALES.includes(pedido.estado)) {
    throw new BadRequestError(Messages.ORDER_CANNOT_BE_MODIFIED);
  }
  if (estado === "cancelado") restaurarStock(pedido);

  return enriquecer(pedidoRepository.updateEstado(id, estado));
};

const cancelar = (usuario, id) => {
  const pedido = getById(id);
  const cliente = getClienteDeUsuario(usuario.id);
  if (pedido.clienteId !== cliente.id) throw new ForbiddenError(Messages.FORBIDDEN);
  if (pedido.estado !== "pendiente") throw new BadRequestError(Messages.ORDER_CANNOT_BE_CANCELLED);

  restaurarStock(pedido);
  return enriquecer(pedidoRepository.updateEstado(id, "cancelado"));
};

export default { getAll, getByCliente, create, cambiarEstado, cancelar };
