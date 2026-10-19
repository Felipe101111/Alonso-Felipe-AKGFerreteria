import "../styles/footer.css";

const Footer = () => (
  <footer className="footer" id="contacto">
    <div className="footer__content">
      <div className="footer__column">
        <h2 className="footer__title">Contacto</h2>
        <address className="footer__address">
          José León Cabezón 2452, C1419 Cdad
          <br />
          011 2316-1697
          <br />
          Lun–Vie 8-19 / Sáb 9:30-19 / Dom 10-13 y 17-19:30
        </address>
      </div>
      <div className="footer__column footer__column--social">
        <h2 className="footer__title">Redes Sociales</h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary footer__social-link"
        >
          Instagram
        </a>
      </div>
    </div>
    <p className="footer__copy">© {new Date().getFullYear()} AKG Ferretería — Todos los derechos reservados</p>
  </footer>
);

export default Footer;
