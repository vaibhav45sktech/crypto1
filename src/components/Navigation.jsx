import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>Market Tracker</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            ₿ Crypto
          </Link>
          <Link 
            to="/stock" 
            className={`nav-link ${location.pathname === '/stock' ? 'active' : ''}`}
          >
            📈 Stocks
          </Link>
          <Link 
            to="/wallet" 
            className={`nav-link ${location.pathname === '/wallet' ? 'active' : ''}`}
          >
            💰 Wallet
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            👤 Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
