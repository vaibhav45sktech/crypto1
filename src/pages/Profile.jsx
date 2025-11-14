import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2025',
    profileImage: '👤',
    portfolio: {
      totalValue: '$45,234.50',
      dayChange: '+$1,245.30',
      dayChangePercent: '+2.85%',
      holdingCount: 8
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...user })

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...user })
  }

  const handleSave = () => {
    setUser({ ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      navigate('/')
      alert('Logged out successfully')
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button 
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <div className="profile-avatar">
            <span className="avatar-icon">{user.profileImage}</span>
          </div>
          
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-group">
                <label>Name</label>
                <p>{user.name}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-group">
                <label>Member Since</label>
                <p>{user.joinDate}</p>
              </div>
              <button 
                className="edit-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="edit-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-group">
                <label htmlFor="joinDate">Member Since</label>
                <input 
                  type="text"
                  id="joinDate"
                  name="joinDate"
                  value={editData.joinDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="edit-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="portfolio-section">
        <h3>Portfolio Overview</h3>
        <div className="portfolio-stats">
          <div className="stat-card">
            <label>Total Value</label>
            <p className="stat-value">{user.portfolio.totalValue}</p>
          </div>
          <div className="stat-card">
            <label>24h Change</label>
            <p className="stat-value positive">{user.portfolio.dayChange}</p>
            <small>{user.portfolio.dayChangePercent}</small>
          </div>
          <div className="stat-card">
            <label>Holdings</label>
            <p className="stat-value">{user.portfolio.holdingCount}</p>
          </div>
        </div>
      </div>

      <div className="portfolio-section">
        <h3>Your Holdings</h3>
        <div className="holdings-list">
          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">BTC</span>
              <span className="holding-label">Bitcoin</span>
            </div>
            <div className="holding-value">
              <p className="amount">0.5 BTC</p>
              <p className="price">$21,283.95</p>
            </div>
          </div>

          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">ETH</span>
              <span className="holding-label">Ethereum</span>
            </div>
            <div className="holding-value">
              <p className="amount">2.5 ETH</p>
              <p className="price">$5,364.18</p>
            </div>
          </div>

          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">AAPL</span>
              <span className="holding-label">Apple Inc.</span>
            </div>
            <div className="holding-value">
              <p className="amount">10 shares</p>
              <p className="price">$2,291.50</p>
            </div>
          </div>

          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">MSFT</span>
              <span className="holding-label">Microsoft</span>
            </div>
            <div className="holding-value">
              <p className="amount">8 shares</p>
              <p className="price">$3,097.60</p>
            </div>
          </div>

          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">XRP</span>
              <span className="holding-label">XRP</span>
            </div>
            <div className="holding-value">
              <p className="amount">1000 XRP</p>
              <p className="price">$2,450.00</p>
            </div>
          </div>

          <div className="holding-item">
            <div className="holding-name">
              <span className="holding-symbol">SOL</span>
              <span className="holding-label">Solana</span>
              </div>
            <div className="holding-value">
              <p className="amount">5 SOL</p>
              <p className="price">$1,747.50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
