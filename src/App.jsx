import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Stock from './pages/Stock'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  )
}

export default App
