import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { JWT_SECRET } from "../utils/config.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new UnauthorizedError(Messages.TOKEN_REQUIRED));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, rol: payload.rol };
    return next();
  } catch {
    return next(new UnauthorizedError(Messages.TOKEN_INVALID));
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return next(new ForbiddenError(Messages.FORBIDDEN));
  }
  return next();
};
