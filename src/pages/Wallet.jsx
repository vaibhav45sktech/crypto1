import { useState } from 'react'
import '../styles/Wallet.css'

export default function Wallet() {
  const [wallet, setWallet] = useState({
    balance: 50000,
    currency: 'USD'
  })

  const [holdings, setHoldings] = useState([
    { symbol: 'BTC', amount: 0.5, price: 42567.89, total: 21283.95 },
    { symbol: 'ETH', amount: 2.5, price: 2145.67, total: 5364.18 },
    { symbol: 'XRP', amount: 1000, price: 2.45, total: 2450.00 },
    { symbol: 'ADA', amount: 5000, price: 1.05, total: 5250.00 },
    { symbol: 'SOL', amount: 5, price: 349.50, total: 1747.50 },
    { symbol: 'DOGE', amount: 15000, price: 0.42, total: 6300.00 }
  ])

  const [transactionHistory, setTransactionHistory] = useState([
    { id: 1, type: 'buy', symbol: 'BTC', amount: 0.5, price: 42567.89, date: '2025-11-14', total: 21283.95 },
    { id: 2, type: 'buy', symbol: 'ETH', amount: 2.5, price: 2145.67, date: '2025-11-13', total: 5364.18 },
    { id: 3, type: 'sell', symbol: 'DOGE', amount: 5000, price: 0.42, date: '2025-11-12', total: 2100.00 }
  ])

  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeForm, setTradeForm] = useState({
    type: 'buy',
    symbol: 'BTC',
    amount: '',
    price: ''
  })

  const [notification, setNotification] = useState('')

  const cryptoPrices = {
    BTC: 42567.89,
    ETH: 2145.67,
    XRP: 2.45,
    ADA: 1.05,
    SOL: 349.50,
    DOGE: 0.42
  }

  const handleTradeChange = (e) => {
    const { name, value } = e.target
    if (name === 'symbol') {
      setTradeForm(prev => ({
        ...prev,
        symbol: value,
        price: cryptoPrices[value]
      }))
    } else {
      setTradeForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleTrade = () => {
    const amount = parseFloat(tradeForm.amount)
    const price = parseFloat(tradeForm.price)

    if (!amount || amount <= 0) {
      showNotification('Please enter a valid amount')
      return
    }

    if (!price || price <= 0) {
      showNotification('Please enter a valid price')
      return
    }

    const total = amount * price

    if (tradeForm.type === 'buy') {
      if (wallet.balance < total) {
        showNotification('Insufficient balance to complete this trade')
        return
      }

      // Update wallet balance
      setWallet(prev => ({
        ...prev,
        balance: prev.balance - total
      }))

      // Update holdings
      const existingHolding = holdings.find(h => h.symbol === tradeForm.symbol)
      if (existingHolding) {
        setHoldings(holdings.map(h =>
          h.symbol === tradeForm.symbol
            ? {
                ...h,
                amount: h.amount + amount,
                total: (h.amount + amount) * h.price
              }
            : h
        ))
      } else {
        setHoldings([
          ...holdings,
          {
            symbol: tradeForm.symbol,
            amount,
            price,
            total
          }
        ])
      }

      showNotification(`Successfully bought ${amount} ${tradeForm.symbol}!`)
    } else {
      // Sell
      const holding = holdings.find(h => h.symbol === tradeForm.symbol)
      if (!holding || holding.amount < amount) {
        showNotification('Insufficient holdings to complete this trade')
        return
      }

      // Update wallet balance
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + total
      }))

      // Update holdings
      if (holding.amount === amount) {
        setHoldings(holdings.filter(h => h.symbol !== tradeForm.symbol))
      } else {
        setHoldings(holdings.map(h =>
          h.symbol === tradeForm.symbol
            ? {
                ...h,
                amount: h.amount - amount,
                total: (h.amount - amount) * h.price
              }
            : h
        ))
      }

      showNotification(`Successfully sold ${amount} ${tradeForm.symbol}!`)
    }

    // Add to transaction history
    setTransactionHistory([
      {
        id: transactionHistory.length + 1,
        type: tradeForm.type,
        symbol: tradeForm.symbol,
        amount,
        price,
        date: new Date().toISOString().split('T')[0],
        total
      },
      ...transactionHistory
    ])

    // Reset form
    setTradeForm({
      type: 'buy',
      symbol: 'BTC',
      amount: '',
      price: cryptoPrices['BTC']
    })
    setShowTradeModal(false)
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 3000)
  }

  const totalPortfolioValue = holdings.reduce((sum, holding) => sum + holding.total, 0) + wallet.balance

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>Virtual Wallet & Trading</h2>
        <button 
          className="trade-btn"
          onClick={() => setShowTradeModal(true)}
        >
          + Buy / Sell
        </button>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <div className="wallet-overview">
        <div className="balance-card">
          <label>Available Balance</label>
          <p className="balance-amount">${wallet.balance.toFixed(2)}</p>
          <small>{wallet.currency}</small>
        </div>

        <div className="balance-card">
          <label>Portfolio Value</label>
          <p className="balance-amount">${totalPortfolioValue.toFixed(2)}</p>
          <small>Crypto + Cash</small>
        </div>

        <div className="balance-card">
          <label>Holdings Value</label>
          <p className="balance-amount">${holdings.reduce((sum, h) => sum + h.total, 0).toFixed(2)}</p>
          <small>{holdings.length} Assets</small>
        </div>
      </div>

      <div className="holdings-section">
        <h3>Your Holdings</h3>
        <div className="holdings-table">
          <div className="table-header">
            <div className="col-symbol">Symbol</div>
            <div className="col-amount">Amount</div>
            <div className="col-price">Price</div>
            <div className="col-total">Total Value</div>
            <div className="col-action">Action</div>
          </div>

          {holdings.length > 0 ? (
            holdings.map((holding, idx) => (
              <div key={idx} className="table-row">
                <div className="col-symbol">
                  <span className="symbol">{holding.symbol}</span>
                </div>
                <div className="col-amount">{holding.amount}</div>
                <div className="col-price">${holding.price.toFixed(2)}</div>
                <div className="col-total">${holding.total.toFixed(2)}</div>
                <div className="col-action">
                  <button 
                    className="action-btn sell-btn"
                    onClick={() => {
                      setTradeForm({
                        type: 'sell',
                        symbol: holding.symbol,
                        amount: '',
                        price: holding.price
                      })
                      setShowTradeModal(true)
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">
              No holdings yet. Start trading to build your portfolio!
            </div>
          )}
        </div>
      </div>

      <div className="transaction-section">
        <h3>Transaction History</h3>
        <div className="transaction-list">
          {transactionHistory.length > 0 ? (
            transactionHistory.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-info">
                  <div className="tx-header">
                    <span className={`tx-type ${tx.type}`}>
                      {tx.type.toUpperCase()}
                    </span>
                    <span className="tx-symbol">{tx.symbol}</span>
                  </div>
                  <small className="tx-date">{tx.date}</small>
                </div>
                <div className="tx-details">
                  <p className="tx-amount">{tx.amount} {tx.symbol}</p>
                  <p className="tx-value">${tx.total.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">
              No transactions yet. Make your first trade!
            </div>
          )}
        </div>
      </div>

      {showTradeModal && (
        <div className="modal-overlay" onClick={() => setShowTradeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{tradeForm.type === 'buy' ? 'Buy Crypto' : 'Sell Crypto'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTradeModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="type">Trade Type</label>
                <select
                  id="type"
                  name="type"
                  value={tradeForm.type}
                  onChange={handleTradeChange}
                  className="form-control"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="symbol">Cryptocurrency</label>
                <select
                  id="symbol"
                  name="symbol"
                  value={tradeForm.symbol}
                  onChange={handleTradeChange}
                  className="form-control"
                >
                  {Object.keys(cryptoPrices).map(sym => (
                    <option key={sym} value={sym}>
                      {sym} - ${cryptoPrices[sym].toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount ({tradeForm.symbol})</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={tradeForm.amount}
                  onChange={handleTradeChange}
                  placeholder="Enter amount"
                  className="form-control"
                  step="0.001"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (USD per {tradeForm.symbol})</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={tradeForm.price}
                  onChange={handleTradeChange}
                  className="form-control"
                  step="0.01"
                  min="0"
                />
              </div>

              {tradeForm.amount && tradeForm.price && (
                <div className="trade-summary">
                  <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>${(parseFloat(tradeForm.amount) * parseFloat(tradeForm.price)).toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Fee (0.5%):</span>
                    <span>${((parseFloat(tradeForm.amount) * parseFloat(tradeForm.price)) * 0.005).toFixed(2)}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>${((parseFloat(tradeForm.amount) * parseFloat(tradeForm.price)) * 1.005).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowTradeModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`btn ${tradeForm.type === 'buy' ? 'btn-buy' : 'btn-sell'}`}
                onClick={handleTrade}
              >
                {tradeForm.type === 'buy' ? 'Buy Now' : 'Sell Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
