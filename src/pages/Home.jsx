import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Home.css'
import '../styles/Chart.css'
import PriceChart from '../components/Chart'

const API_KEY = 'LRY3NRQ0QJTP8GMK'
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

export default function Home() {
  const [cryptoData, setCryptoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [symbol, setSymbol] = useState('BTC')

  useEffect(() => {
    fetchCryptoData(symbol)
  }, [symbol])

  // Mock data for demonstration - Cryptocurrency prices
  const mockData = {
    'BTC': {
      '01. symbol': 'BTC',
      '02. name': 'Bitcoin',
      '03. price_usd': '42,567.89',
      '04. price_change_24h': '2.45',
      '05. high_24h': '43,245.00',
      '06. low_24h': '41,890.50',
      '07. volume_24h': '28,456,000,000',
      '08. market_cap': '835,467,000,000',
      '09. percent_change_24h': '2.45%',
      '10. last_updated': '2025-11-15'
    },
    'ETH': {
      '01. symbol': 'ETH',
      '02. name': 'Ethereum',
      '03. price_usd': '2,145.67',
      '04. price_change_24h': '1.82',
      '05. high_24h': '2,189.45',
      '06. low_24h': '2,089.23',
      '07. volume_24h': '15,234,567,890',
      '08. market_cap': '257,890,000,000',
      '09. percent_change_24h': '1.82%',
      '10. last_updated': '2025-11-15'
    },
    'XRP': {
      '01. symbol': 'XRP',
      '02. name': 'XRP',
      '03. price_usd': '2.45',
      '04. price_change_24h': '3.12',
      '05. high_24h': '2.56',
      '06. low_24h': '2.34',
      '07. volume_24h': '4,567,890,123',
      '08. market_cap': '135,678,900,000',
      '09. percent_change_24h': '3.12%',
      '10. last_updated': '2025-11-15'
    },
    'ADA': {
      '01. symbol': 'ADA',
      '02. name': 'Cardano',
      '03. price_usd': '0.98',
      '04. price_change_24h': '2.67',
      '05. high_24h': '1.02',
      '06. low_24h': '0.95',
      '07. volume_24h': '2,345,678,901',
      '08. market_cap': '35,678,000,000',
      '09. percent_change_24h': '2.67%',
      '10. last_updated': '2025-11-15'
    },
    'SOL': {
      '01. symbol': 'SOL',
      '02. name': 'Solana',
      '03. price_usd': '198.45',
      '04. price_change_24h': '4.23',
      '05. high_24h': '205.67',
      '06. low_24h': '189.34',
      '07. volume_24h': '3,456,789,012',
      '08. market_cap': '89,234,567,890',
      '09. percent_change_24h': '4.23%',
      '10. last_updated': '2025-11-15'
    },
    'DOGE': {
      '01. symbol': 'DOGE',
      '02. name': 'Dogecoin',
      '03. price_usd': '0.42',
      '04. price_change_24h': '3.89',
      '05. high_24h': '0.44',
      '06. low_24h': '0.40',
      '07. volume_24h': '1,234,567,890',
      '08. market_cap': '61,234,567,890',
      '09. percent_change_24h': '3.89%',
      '10. last_updated': '2025-11-15'
    }
  }

  const fetchCryptoData = async (ticker) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: ticker,
          to_currency: 'USD',
          apikey: API_KEY
        }
      })

      if (response.data['Note'] || response.data['Information']) {
        if (mockData[ticker]) {
          setCryptoData(mockData[ticker])
        } else {
          setError('API rate limited. Please try: BTC, ETH, XRP, ADA, SOL, DOGE')
        }
      } else if (response.data['Realtime Currency Exchange Rate']) {
        const data = response.data['Realtime Currency Exchange Rate']
        setCryptoData({
          '01. symbol': data['From_Currency Code'],
          '02. name': data['From_Currency Name'],
          '03. price_usd': data['Exchange Rate'],
          '04. price_change_24h': '0.00',
          '05. high_24h': data['Exchange Rate'],
          '06. low_24h': data['Exchange Rate'],
          '07. volume_24h': 'N/A',
          '08. market_cap': 'N/A',
          '09. percent_change_24h': '0.00%',
          '10. last_updated': data['Last Refreshed']
        })
      } else {
        if (mockData[ticker]) {
          setCryptoData(mockData[ticker])
        } else {
          setError('No data found for this cryptocurrency.')
        }
      }
    } catch (err) {
      if (mockData[ticker]) {
        setCryptoData(mockData[ticker])
      } else {
        setError('Failed to fetch data. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const inputSymbol = e.target.ticker.value.toUpperCase()
    if (inputSymbol) {
      setSymbol(inputSymbol)
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>₿ Cryptocurrency Tracker</h1>
        <p>Real-time crypto market data powered by Alpha Vantage</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          name="ticker"
          placeholder="Enter crypto symbol (e.g., BTC, ETH, XRP)"
          defaultValue="BTC"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {cryptoData && !loading && (
        <div className="stock-data-card">
          <div className="demo-badge">💰 Demo Data</div>
          <div className="stock-header">
            <div>
              <h2>{cryptoData['01. symbol']}</h2>
              <p className="crypto-name">{cryptoData['02. name']}</p>
            </div>
            <span className={`price-change ${parseFloat(cryptoData['04. price_change_24h']) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(cryptoData['04. price_change_24h']) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(cryptoData['04. price_change_24h'])).toFixed(2)}
            </span>
          </div>

          <div className="stock-info-grid">
            <div className="info-item">
              <label>Price (USD)</label>
              <p className="info-value">${cryptoData['03. price_usd']}</p>
            </div>
            <div className="info-item">
              <label>Change 24h</label>
              <p className={`info-value ${parseFloat(cryptoData['09. percent_change_24h']) >= 0 ? 'positive' : 'negative'}`}>
                {cryptoData['09. percent_change_24h']}
              </p>
            </div>
            <div className="info-item">
              <label>High 24h</label>
              <p className="info-value">${cryptoData['05. high_24h']}</p>
            </div>
            <div className="info-item">
              <label>Low 24h</label>
              <p className="info-value">${cryptoData['06. low_24h']}</p>
            </div>
            <div className="info-item">
              <label>Volume 24h</label>
              <p className="info-value">${cryptoData['07. volume_24h']}</p>
            </div>
            <div className="info-item">
              <label>Market Cap</label>
              <p className="info-value">${cryptoData['08. market_cap']}</p>
            </div>
          </div>

          <div className="data-footer">
            <small>Last updated: {new Date().toLocaleString()}</small>
          </div>
        </div>
      )}

      {cryptoData && !loading && (
        <PriceChart symbol={symbol} data={cryptoData} />
      )}

      <div className="info-section">
        <h3>Popular Cryptocurrencies</h3>
        <div className="ticker-buttons">
          {['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOGE'].map((ticker) => (
            <button
              key={ticker}
              onClick={() => setSymbol(ticker)}
              className={`ticker-btn ${symbol === ticker ? 'active' : ''}`}
            >
              {ticker}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
