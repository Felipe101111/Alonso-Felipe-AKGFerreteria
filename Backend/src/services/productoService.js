import productoRepository from "../repositories/productoRepository.js";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isEmpty } from "../utils/validators.js";

const isValidPrice = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
const isValidStock = (value) => Number.isInteger(value) && value >= 0;

const getAll = ({ nombre, categoria } = {}) => {
  let productos = productoRepository.findAll();
  if (!isEmpty(nombre)) {
    productos = productos.filter((p) => p.nombre.toLowerCase().includes(String(nombre).toLowerCase()));
  }
  if (!isEmpty(categoria)) {
    productos = productos.filter((p) => p.categoria === categoria);
  }
  return productos;
};

const getById = (id) => {
  const producto = productoRepository.findById(id);
  if (!producto) {
    throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
  }
  return producto;
};

const create = ({ nombre, descripcion, precio, stock, categoria }) => {
  if (isEmpty(nombre) || !isValidPrice(precio) || !isValidStock(stock)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (productoRepository.findByNombre(nombre)) {
    throw new ConflictError(Messages.DUPLICATED_PRODUCT);
  }
  return productoRepository.create({
    nombre: nombre.trim(),
    descripcion: descripcion ?? "",
    precio,
    stock,
    categoria: categoria ?? "",
  });
};

const update = (id, datos) => {
  getById(id);

  const { nombre, descripcion, precio, stock, categoria } = datos;

  if (nombre !== undefined && isEmpty(nombre)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (precio !== undefined && !isValidPrice(precio)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (stock !== undefined && !isValidStock(stock)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (nombre !== undefined) {
    const existente = productoRepository.findByNombre(nombre);
    if (existente && existente.id !== Number(id)) {
      throw new ConflictError(Messages.DUPLICATED_PRODUCT);
    }
  }

  const cambios = Object.fromEntries(
    Object.entries({ nombre, descripcion, precio, stock, categoria }).filter(([, v]) => v !== undefined),
  );
  return productoRepository.update(id, cambios);
};

const remove = (id) => {
  getById(id);
  return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
