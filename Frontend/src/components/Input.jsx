import "../styles/components.css";

const Input = ({ id, label, error, className = "", ...rest }) => (
  <div className="form-field">
    <label htmlFor={id} className="form-field__label">
      {label}
    </label>
    <input
      id={id}
      className={`form-field__input ${error ? "form-field__input--error" : ""} ${className}`.trim()}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
    />
    {error && (
      <span id={`${id}-error`} className="form-field__error" role="alert">
        {error}
      </span>
    )}
  </div>
);

export default Input;
