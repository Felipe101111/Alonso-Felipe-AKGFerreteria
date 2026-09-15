import AppError from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import errorResponse from "../responses/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  console.error(err);
  return errorResponse(res, Messages.INTERNAL_SERVER_ERROR, 500);
};

export default errorHandler;
