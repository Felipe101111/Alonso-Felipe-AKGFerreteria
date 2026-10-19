import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const stored = localStorage.getItem("usuario");
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    else localStorage.removeItem("usuario");
  }, [usuario]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const register = async (datos) => {
    const data = await authService.register(datos);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUsuario(null);
  };

  const value = {
    usuario,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: usuario?.rol === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
