import './BotonPrincipal.css'

function BotonPrincipal({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default BotonPrincipal
