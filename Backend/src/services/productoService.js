import productoRepository from "../repositories/productoRepository.js";
import { BadRequestError, NotFoundError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

const getAll = () => productoRepository.findAll();

const getById = (id) => {
  const producto = productoRepository.findById(id);
  if (!producto) {
    throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
  }
  return producto;
};

const create = ({ nombre, descripcion, precio, stock, categoria }) => {
  if (!nombre || precio === undefined || stock === undefined) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (typeof precio !== "number" || precio < 0) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (typeof stock !== "number" || stock < 0) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  return productoRepository.create({ nombre, descripcion, precio, stock, categoria });
};

const update = (id, datos) => {
  getById(id);

  const { nombre, precio, stock } = datos;

  if (nombre !== undefined && !nombre) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (precio !== undefined && (typeof precio !== "number" || precio < 0)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }

  return productoRepository.update(id, datos);
};

const remove = (id) => {
  getById(id);
  return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
