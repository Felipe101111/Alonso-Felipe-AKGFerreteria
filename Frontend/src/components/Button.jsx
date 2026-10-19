import "../styles/components.css";

const Button = ({ variant = "primary", type = "button", className = "", children, ...rest }) => (
  <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...rest}>
    {children}
  </button>
);

export default Button;
