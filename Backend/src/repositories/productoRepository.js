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

const findByNombre = (nombre) =>
  productos.find((p) => p.nombre.trim().toLowerCase() === String(nombre).trim().toLowerCase());

const findCategorias = () => Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean)));

// Catálogo inicial de ejemplo.
[
  ["Martillo carpintero", "Martillo de acero con mango de madera", 8500, 25, "Herramientas"],
  ["Destornillador Phillips", "Destornillador punta Phillips PH2", 3200, 40, "Herramientas"],
  ["Taladro percutor 650W", "Taladro eléctrico con maletín", 78000, 8, "Herramientas"],
  ["Cable unipolar 2,5mm", "Rollo de 100 metros", 52000, 12, "Electricidad"],
  ["Lámpara LED 12W", "Luz cálida E27", 2100, 60, "Electricidad"],
  ["Pintura látex 20L", "Pintura blanca interior/exterior", 64000, 10, "Pinturas"],
].forEach(([nombre, descripcion, precio, stock, categoria]) =>
  create({ nombre, descripcion, precio, stock, categoria }),
);

export default { findAll, findById, findByNombre, findCategorias, create, update, remove };
