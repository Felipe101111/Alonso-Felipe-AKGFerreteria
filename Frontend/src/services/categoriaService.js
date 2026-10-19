import request from "./httpClient";

const getAll = () => request("/categorias");

export default { getAll };
