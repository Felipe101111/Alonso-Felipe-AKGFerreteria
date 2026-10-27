import pedidoService from "../services/pedidoService.js";
import successResponse from "../responses/successResponse.js";

const getAll = (req, res, next) => {
  try {
    successResponse(res, pedidoService.getAll());
  } catch (error) {
    next(error);
  }
};

const getByCliente = (req, res, next) => {
  try {
    successResponse(res, pedidoService.getByCliente(req.user, req.params.clienteId));
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  try {
    successResponse(res, pedidoService.create(req.user.id, req.body ?? {}), 201);
  } catch (error) {
    next(error);
  }
};

const cambiarEstado = (req, res, next) => {
  try {
    successResponse(res, pedidoService.cambiarEstado(req.params.id, req.body?.estado));
  } catch (error) {
    next(error);
  }
};

const cancelar = (req, res, next) => {
  try {
    successResponse(res, pedidoService.cancelar(req.user, req.params.id));
  } catch (error) {
    next(error);
  }
};

export default { getAll, getByCliente, create, cambiarEstado, cancelar };
