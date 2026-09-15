import productoService from "../services/productoService.js";
import successResponse from "../responses/successResponse.js";

const getAll = (req, res, next) => {
  try {
    const productos = productoService.getAll();
    successResponse(res, productos);
  } catch (error) {
    next(error);
  }
};

const getById = (req, res, next) => {
  try {
    const producto = productoService.getById(req.params.id);
    successResponse(res, producto);
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const nuevoProducto = productoService.create({ nombre, descripcion, precio, stock, categoria });
    successResponse(res, nuevoProducto, 201);
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  try {
    const productoActualizado = productoService.update(req.params.id, req.body);
    successResponse(res, productoActualizado);
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  try {
    productoService.remove(req.params.id);
    successResponse(res, null);
  } catch (error) {
    next(error);
  }
};

export default { getAll, getById, create, update, remove };
