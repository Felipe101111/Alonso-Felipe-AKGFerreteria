import request from "./httpClient";

const getByCliente = (clienteId) => request(`/pedidos/cliente/${clienteId}`, { auth: true });

const getAll = () => request("/pedidos", { auth: true });

const create = (datos) => request("/pedidos", { method: "POST", body: datos, auth: true });

const cambiarEstado = (id, estado) =>
  request(`/pedidos/${id}/estado`, { method: "PATCH", body: { estado }, auth: true });

const cancelar = (id) => request(`/pedidos/${id}/cancelar`, { method: "PATCH", auth: true });

export default { getByCliente, getAll, create, cambiarEstado, cancelar };
