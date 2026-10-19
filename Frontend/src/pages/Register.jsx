import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isEmpty, isValidEmail, isValidPassword } from "../utils/validators";
import "../styles/auth.css";

const FORM_INICIAL = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (isEmpty(form.nombre)) nuevosErrores.nombre = "El nombre es obligatorio.";

    if (isEmpty(form.email)) nuevosErrores.email = "El email es obligatorio.";
    else if (!isValidEmail(form.email)) nuevosErrores.email = "Ingresá un email válido.";

    if (isEmpty(form.password)) nuevosErrores.password = "La contraseña es obligatoria.";
    else if (!isValidPassword(form.password)) nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";

    if (form.confirmPassword !== form.password) nuevosErrores.confirmPassword = "Las contraseñas no coinciden.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        password: form.password,
      });
      showToast("Cuenta creada con éxito.", "success");
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
        <h1 className="section-title">Crear Cuenta</h1>
        <Input
          id="nombre"
          name="nombre"
          label="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          error={errores.nombre}
          autoComplete="name"
        />
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
          id="telefono"
          name="telefono"
          label="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          autoComplete="tel"
        />
        <Input
          id="direccion"
          name="direccion"
          label="Dirección"
          value={form.direccion}
          onChange={handleChange}
          autoComplete="street-address"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          value={form.password}
          onChange={handleChange}
          error={errores.password}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errores.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" variant="primary" disabled={enviando} className="auth__submit">
          {enviando ? "Creando cuenta..." : "Registrarme"}
        </Button>
        <p className="auth__alt">
          ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
