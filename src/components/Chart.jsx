import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '../styles/Chart.css'

export default function PriceChart({ symbol, data }) {
  // Generate mock historical data
  const generateChartData = () => {
    const basePrice = parseFloat(data?.['03. price_usd'] || data?.['05. price'] || 100)
    const chartData = []
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const variance = (Math.random() - 0.5) * basePrice * 0.1
      const price = basePrice + variance
      
      chartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2)),
        fullDate: date.toISOString()
      })
    }
    return chartData
  }

  const chartData = generateChartData()
  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{symbol} Price Chart (30 Days)</h3>
        <div className="chart-stats">
          <span className="stat">High: ${maxPrice.toFixed(2)}</span>
          <span className="stat">Low: ${minPrice.toFixed(2)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#999"
            tick={{ fontSize: 12 }}
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #667eea',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => `$${value.toFixed(2)}`}
            labelStyle={{ color: '#333' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#667eea" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <p>30-day price history chart. Data is simulated for demonstration purposes.</p>
      </div>
    </div>
  )
}
