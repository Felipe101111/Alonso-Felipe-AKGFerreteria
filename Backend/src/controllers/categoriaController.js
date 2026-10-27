import categoriaService from "../services/categoriaService.js";
import successResponse from "../responses/successResponse.js";

const getAll = (req, res, next) => {
  try {
    successResponse(res, categoriaService.getAll());
  } catch (error) {
    next(error);
  }
};

export default { getAll };
