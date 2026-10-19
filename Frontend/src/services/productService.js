import request from "./httpClient";

const getAll = (filtros = {}) => {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== undefined && valor !== "")),
  ).toString();
  return request(`/productos${params ? `?${params}` : ""}`);
};

const getById = (id) => request(`/productos/${id}`);

const create = (datos) => request("/productos", { method: "POST", body: datos, auth: true });

const update = (id, datos) => request(`/productos/${id}`, { method: "PUT", body: datos, auth: true });

const remove = (id) => request(`/productos/${id}`, { method: "DELETE", auth: true });

export default { getAll, getById, create, update, remove };
