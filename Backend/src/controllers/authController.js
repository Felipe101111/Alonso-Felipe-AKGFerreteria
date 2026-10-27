import authService from "../services/authService.js";
import successResponse from "../responses/successResponse.js";

const register = (req, res, next) => {
  try {
    successResponse(res, authService.register(req.body ?? {}), 201);
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  try {
    successResponse(res, authService.login(req.body ?? {}));
  } catch (error) {
    next(error);
  }
};

export default { register, login };
