import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p>
        <Link to="/vincular-whatsapp" className="footer__link">Vincular WhatsApp</Link>
        {' · '}
        &copy; 2026 Milonga La Bataclana. Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
