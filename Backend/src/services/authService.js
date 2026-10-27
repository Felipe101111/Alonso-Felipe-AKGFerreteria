import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usuarioRepository from "../repositories/usuarioRepository.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";
import { isEmpty, isValidEmail, isValidPassword } from "../utils/validators.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/config.js";

const toPublicUser = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});

const buildSession = (usuario) => ({
  token: jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
  usuario: toPublicUser(usuario),
});

const register = ({ nombre, email, password, telefono, direccion }) => {
  if (isEmpty(nombre)) throw new BadRequestError(Messages.INVALID_DATA);
  if (!isValidEmail(email)) throw new BadRequestError(Messages.INVALID_EMAIL);
  if (!isValidPassword(password)) throw new BadRequestError(Messages.INVALID_PASSWORD);
  if (usuarioRepository.findByEmail(email)) {
    throw new ConflictError(Messages.EMAIL_ALREADY_REGISTERED);
  }

  const usuario = usuarioRepository.create({
    nombre: nombre.trim(),
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    rol: "cliente",
  });
  clienteRepository.create({
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: telefono ?? "",
    direccion: direccion ?? "",
    usuarioId: usuario.id,
  });

  return buildSession(usuario);
};

const login = ({ email, password }) => {
  if (!isValidEmail(email) || isEmpty(password)) {
    throw new BadRequestError(Messages.INVALID_DATA);
  }
  const usuario = usuarioRepository.findByEmail(email);
  if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
    throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
  }
  return buildSession(usuario);
};

export default { register, login };
