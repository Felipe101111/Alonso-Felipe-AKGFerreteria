import request from "./httpClient";

const login = (email, password) => request("/auth/login", { method: "POST", body: { email, password } });

const register = ({ nombre, email, password, telefono, direccion }) =>
  request("/auth/register", {
    method: "POST",
    body: { nombre, email, password, telefono, direccion },
  });

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

export default { login, register, logout };
