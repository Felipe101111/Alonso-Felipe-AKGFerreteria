import Producto from "../models/Producto.js";

let productos = [];
let nextId = 1;

const findAll = () => productos;

const findById = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  return productos.find((p) => p.id === numericId);
};

const create = ({ nombre, descripcion, precio, stock, categoria }) => {
  const nuevoProducto = new Producto(nextId++, nombre, descripcion, precio, stock, categoria);
  productos.push(nuevoProducto);
  return nuevoProducto;
};

const update = (id, datos) => {
  const producto = findById(id);
  if (!producto) return null;
  Object.assign(producto, datos);
  return producto;
};

const remove = (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return false;
  const index = productos.findIndex((p) => p.id === numericId);
  if (index === -1) return false;
  productos.splice(index, 1);
  return true;
};

export default { findAll, findById, create, update, remove };
