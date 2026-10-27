import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import Admin from "../models/Admin.js";

const usuarios = [];
const admins = [];
let nextId = 1;

const findById = (id) => usuarios.find((u) => u.id === Number(id));

const findByEmail = (email) =>
  usuarios.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());

const create = ({ nombre, email, passwordHash, rol }) => {
  const usuario = new Usuario(nextId++, nombre, email.trim().toLowerCase(), passwordHash, rol);
  usuarios.push(usuario);
  return usuario;
};

const createAdmin = ({ nombre, email, usuarioId }) => {
  const admin = new Admin(admins.length + 1, nombre, email, usuarioId);
  admins.push(admin);
  return admin;
};

// Administrador inicial del sistema.
const adminUsuario = create({
  nombre: "Administrador",
  email: "admin@akg.com",
  passwordHash: bcrypt.hashSync("admin1234", 10),
  rol: "admin",
});
createAdmin({ nombre: adminUsuario.nombre, email: adminUsuario.email, usuarioId: adminUsuario.id });

export default { findById, findByEmail, create };
