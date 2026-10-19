import "../styles/components.css";

const ESTADO_VARIANTES = {
  pendiente: "badge--pendiente",
  "en proceso": "badge--proceso",
  enviado: "badge--enviado",
  entregado: "badge--entregado",
  cancelado: "badge--cancelado",
};

const Badge = ({ estado }) => {
  const variante = ESTADO_VARIANTES[estado?.toLowerCase()] ?? "";
  return <span className={`badge ${variante}`.trim()}>{estado}</span>;
};

export default Badge;
