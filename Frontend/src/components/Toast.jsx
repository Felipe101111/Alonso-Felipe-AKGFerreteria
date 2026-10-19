import "../styles/components.css";

const ICONOS = { success: "✓", error: "✕", info: "ℹ" };

const Toast = ({ message, type = "info", onClose }) => (
  <div className={`toast toast--${type}`} role="status">
    <span className="toast__icon" aria-hidden="true">
      {ICONOS[type] ?? ICONOS.info}
    </span>
    <p className="toast__message">{message}</p>
    <button type="button" className="toast__close" onClick={onClose} aria-label="Cerrar notificación">
      ×
    </button>
  </div>
);

export default Toast;
