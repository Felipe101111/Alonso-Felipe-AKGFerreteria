import productoRepository from "../repositories/productoRepository.js";

const getAll = () => productoRepository.findCategorias();

export default { getAll };
