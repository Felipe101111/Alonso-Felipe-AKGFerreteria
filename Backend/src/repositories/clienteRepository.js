import Cliente from "../models/Cliente.js";

const clientes = [];
let nextId = 1;

const findById = (id) => clientes.find((c) => c.id === Number(id));

const findByUsuarioId = (usuarioId) => clientes.find((c) => c.usuarioId === Number(usuarioId));

const create = ({ nombre, email, telefono, direccion, usuarioId }) => {
  const cliente = new Cliente(nextId++, nombre, email, telefono, direccion, usuarioId);
  clientes.push(cliente);
  return cliente;
};

export default { findById, findByUsuarioId, create };
