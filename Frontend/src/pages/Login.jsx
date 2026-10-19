import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isEmpty, isValidEmail, isValidPassword } from "../utils/validators";
import "../styles/auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (isEmpty(form.email)) nuevosErrores.email = "El email es obligatorio.";
    else if (!isValidEmail(form.email)) nuevosErrores.email = "Ingresá un email válido.";

    if (isEmpty(form.password)) nuevosErrores.password = "La contraseña es obligatoria.";
    else if (!isValidPassword(form.password)) nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await login(form.email, form.password);
      showToast("Bienvenido/a de nuevo.", "success");
      navigate("/");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="auth">
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <h1 className="section-title">Ingresar</h1>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          error={errores.email}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
          autoComplete="current-password"
        />
        <Button type="submit" variant="primary" disabled={enviando} className="auth__submit">
          {enviando ? "Ingresando..." : "Ingresar"}
        </Button>
        <p className="auth__alt">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
