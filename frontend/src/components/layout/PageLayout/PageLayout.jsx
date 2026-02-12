import { Footer } from '../../index'
import imagenFondo from '../../../assets/imagen-fondo.jpg'
import './PageLayout.css'

function PageLayout({ children, showLogo = false, backgroundImage }) {
  const bgImage = backgroundImage || imagenFondo
  return (
    <div className="page-layout">
      <div 
        className="page-layout__background"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="page-layout__overlay"></div>
        {showLogo && (
          <h2 className="page-layout__logo">
            <span className="page-layout__logo-milonga">Milonga</span>
            <span className="page-layout__logo-bataclana">Bataclana</span>
          </h2>
        )}
        <div className="page-layout__content">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PageLayout
