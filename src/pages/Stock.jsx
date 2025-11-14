import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Home.css'
import '../styles/Chart.css'
import PriceChart from '../components/Chart'

const API_KEY = 'LRY3NRQ0QJTP8GMK'
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

export default function Stock() {
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [symbol, setSymbol] = useState('AAPL')

  useEffect(() => {
    fetchStockData(symbol)
  }, [symbol])

  // Mock data for demonstration
  const mockData = {
    'AAPL': {
      '01. symbol': 'AAPL',
      '02. open': '235.45',
      '03. high': '237.89',
      '04. low': '234.21',
      '05. price': '236.54',
      '06. volume': '42567890',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '235.12',
      '09. change': '1.42',
      '10. change percent': '0.60%'
    },
    'MSFT': {
      '01. symbol': 'MSFT',
      '02. open': '428.70',
      '03. high': '431.20',
      '04. low': '427.45',
      '05. price': '430.15',
      '06. volume': '18234567',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '428.90',
      '09. change': '1.25',
      '10. change percent': '0.29%'
    },
    'GOOGL': {
      '01. symbol': 'GOOGL',
      '02. open': '175.30',
      '03. high': '177.89',
      '04. low': '174.56',
      '05. price': '176.45',
      '06. volume': '21345678',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '175.20',
      '09. change': '1.25',
      '10. change percent': '0.71%'
    },
    'AMZN': {
      '01. symbol': 'AMZN',
      '02. open': '194.50',
      '03. high': '196.78',
      '04. low': '193.20',
      '05. price': '195.67',
      '06. volume': '38456789',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '193.45',
      '09. change': '2.22',
      '10. change percent': '1.15%'
    },
    'TSLA': {
      '01. symbol': 'TSLA',
      '02. open': '287.45',
      '03. high': '290.12',
      '04. low': '285.67',
      '05. price': '288.90',
      '06. volume': '52341234',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '286.54',
      '09. change': '2.36',
      '10. change percent': '0.82%'
    },
    'META': {
      '01. symbol': 'META',
      '02. open': '567.89',
      '03. high': '572.34',
      '04. low': '565.12',
      '05. price': '570.56',
      '06. volume': '15234567',
      '07. latest trading day': '2025-11-15',
      '08. previous close': '568.90',
      '09. change': '1.66',
      '10. change percent': '0.29%'
    }
  }

  const fetchStockData = async (ticker) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: API_KEY
        }
      })

      // Check if we got rate limited or no data
      if (response.data['Note'] || response.data['Information']) {
        // Use mock data as fallback during rate limiting
        if (mockData[ticker]) {
          console.warn('API rate limited, showing demo data')
          setStockData(mockData[ticker])
        } else {
          setError('API rate limited. Please try a popular ticker: AAPL, MSFT, GOOGL, AMZN, TSLA, META')
        }
      } else if (response.data['Global Quote'] && Object.keys(response.data['Global Quote']).length > 0) {
        setStockData(response.data['Global Quote'])
      } else {
        // Fallback to mock data if available
        if (mockData[ticker]) {
          setStockData(mockData[ticker])
        } else {
          setError('No data found for this symbol. Please try another.')
        }
      }
    } catch (err) {
      // Use mock data on error
      if (mockData[ticker]) {
        console.warn('Error fetching real data, showing demo data:', err.message)
        setStockData(mockData[ticker])
      } else {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
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
        <h1>📈 Stock Price Tracker</h1>
        <p>Real-time data powered by Alpha Vantage</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          name="ticker"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
          defaultValue="AAPL"
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

      {stockData && !loading && (
        <div className="stock-data-card">
          <div className="demo-badge">📊 Demo Data (Showing Sample Stock Prices)</div>
          <div className="stock-header">
            <h2>{stockData['01. symbol']}</h2>
            <span className={`price-change ${parseFloat(stockData['09. change']) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(stockData['09. change']) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(stockData['09. change'])).toFixed(2)}
            </span>
          </div>

          <div className="stock-info-grid">
            <div className="info-item">
              <label>Price</label>
              <p className="info-value">${parseFloat(stockData['05. price']).toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>Change %</label>
              <p className={`info-value ${parseFloat(stockData['10. change percent']) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(stockData['10. change percent']).toFixed(2)}%
              </p>
            </div>
            <div className="info-item">
              <label>High</label>
              <p className="info-value">${parseFloat(stockData['03. high']).toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>Low</label>
              <p className="info-value">${parseFloat(stockData['04. low']).toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>Volume</label>
              <p className="info-value">{parseInt(stockData['06. volume']).toLocaleString()}</p>
            </div>
            <div className="info-item">
              <label>Latest Trading Day</label>
              <p className="info-value">{stockData['07. latest trading day']}</p>
            </div>
            <div className="info-item">
              <label>Previous Close</label>
              <p className="info-value">${parseFloat(stockData['08. previous close']).toFixed(2)}</p>
            </div>
            <div className="info-item">
              <label>Open</label>
              <p className="info-value">${parseFloat(stockData['02. open']).toFixed(2)}</p>
            </div>
          </div>

          <div className="data-footer">
            <small>Last updated: {new Date().toLocaleString()}</small>
          </div>
        </div>
      )}

      {stockData && !loading && (
        <PriceChart symbol={symbol} data={stockData} />
      )}

      <div className="info-section">
        <h3>Popular Tickers</h3>
        <div className="ticker-buttons">
          {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'].map((ticker) => (
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
