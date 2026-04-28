import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Bitcoin, Send, Download, RefreshCw, Eye, EyeOff,
  Wallet, CreditCard, Shield, AlertCircle,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

export const Route = createFileRoute('/_banking/dashboard')({
  component: Dashboard,
})

const spendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Income',
      data: [8500, 9200, 8800, 10200, 9800, 11200, 10800],
      borderColor: 'oklch(0.65 0.18 145)',
      backgroundColor: 'oklch(0.65 0.18 145 / 0.1)',
      fill: true, tension: 0.4, pointRadius: 4,
      pointBackgroundColor: 'oklch(0.65 0.18 145)',
    },
    {
      label: 'Expenses',
      data: [4200, 5100, 4800, 5800, 5200, 6100, 5600],
      borderColor: 'oklch(0.56 0.24 265)',
      backgroundColor: 'oklch(0.56 0.24 265 / 0.08)',
      fill: true, tension: 0.4, pointRadius: 4,
      pointBackgroundColor: 'oklch(0.56 0.24 265)',
    },
  ],
}

const recentTransactions = [
  { id: 1, name: 'Amazon Purchase', type: 'debit', amount: -124.99, date: 'Apr 27, 2026', category: 'Shopping', icon: '🛍️' },
  { id: 2, name: 'Salary Deposit', type: 'credit', amount: 5400.00, date: 'Apr 25, 2026', category: 'Income', icon: '💰' },
  { id: 3, name: 'Netflix Subscription', type: 'debit', amount: -15.99, date: 'Apr 24, 2026', category: 'Subscription', icon: '🎬' },
  { id: 4, name: 'BTC Purchase', type: 'crypto', amount: -500.00, date: 'Apr 22, 2026', category: 'Crypto', icon: '₿' },
  { id: 5, name: 'Wire Transfer — Jane', type: 'credit', amount: 300.00, date: 'Apr 21, 2026', category: 'Transfer', icon: '↗️' },
  { id: 6, name: 'Electric Bill', type: 'debit', amount: -87.50, date: 'Apr 20, 2026', category: 'Bills', icon: '⚡' },
]

const cryptoHoldings = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.4821, value: 30218.40, change: 2.4, color: 'oklch(0.74 0.17 75)' },
  { symbol: 'ETH', name: 'Ethereum', amount: 3.2100, value: 9428.50, change: -1.2, color: 'oklch(0.60 0.20 265)' },
  { symbol: 'USDT', name: 'Tether', amount: 2500.00, value: 2500.00, change: 0.01, color: 'oklch(0.65 0.18 145)' },
]

function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)

  useEffect(() => setMounted(true), [])

  const mask = (v: string) => hideBalance ? '••••••' : v

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monday, April 28, 2026 · Account Summary</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/deposit" className="btn btn-secondary btn-sm">
            <Download size={14} /> Deposit Check
          </Link>
          <Link to="/transfers" className="btn btn-primary btn-sm">
            <Send size={14} /> Send Money
          </Link>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Account Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {/* Checking */}
          <div className="bank-card gradient-brand" style={{ boxShadow: '0 8px 32px oklch(0.56 0.24 265 / 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Checking Account</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 2 }}>•••• •••• •••• 4821</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setHideBalance(!hideBalance)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4 }}>
                  {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Wallet size={20} style={{ opacity: 0.8 }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: 2 }}>Available Balance</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{mask('$24,850.00')}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>John Doe</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>Exp 04/29</div>
            </div>
          </div>

          {/* Savings */}
          <div className="bank-card gradient-gold" style={{ boxShadow: '0 8px 32px oklch(0.74 0.17 75 / 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Savings Account</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 2 }}>•••• •••• •••• 7293</div>
              </div>
              <Shield size={20} style={{ opacity: 0.8 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: 2 }}>Available Balance</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'oklch(0.10 0.02 265)' }}>{mask('$48,200.00')}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, color: 'oklch(0.10 0.02 265)' }}>APY 4.25%</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, color: 'oklch(0.10 0.02 265)' }}>John Doe</div>
            </div>
          </div>

          {/* Crypto */}
          <div className="bank-card gradient-crypto" style={{ boxShadow: '0 8px 32px oklch(0.62 0.20 45 / 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crypto Wallet</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 2 }}>3 assets</div>
              </div>
              <Bitcoin size={20} style={{ opacity: 0.8 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: 2 }}>Portfolio Value</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{mask('$42,146.90')}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                <span style={{ color: 'oklch(0.75 0.18 145)' }}>↑ 3.2%</span> today
              </div>
              <Link to="/crypto" style={{ fontSize: '0.72rem', opacity: 0.8, color: 'white', textDecoration: 'none' }}>View →</Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Balance', value: '$73,050.00', change: '+2.4%', up: true, icon: Wallet },
            { label: 'Monthly Income', value: '$10,800', change: '+8.2%', up: true, icon: TrendingUp },
            { label: 'Monthly Spend', value: '$5,600', change: '-4.1%', up: false, icon: TrendingDown },
            { label: 'Pending Deposits', value: '$1,200', change: '2 checks', up: true, icon: Shield },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
                <s.icon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 4 }}>{mask(s.value)}</div>
              <div style={{ fontSize: '0.75rem', color: s.up ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                {s.up ? '↑' : '↓'} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Crypto */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Cash Flow Overview</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last 7 months</span>
            </div>
            {mounted && (
              <Line data={spendingData} options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: 'oklch(0.65 0.04 265)', font: { size: 11 } } },
                  tooltip: { mode: 'index', intersect: false },
                },
                scales: {
                  x: { ticks: { color: 'oklch(0.50 0.03 265)', font: { size: 11 } }, grid: { color: 'oklch(0.20 0.02 265)' } },
                  y: { ticks: { color: 'oklch(0.50 0.03 265)', font: { size: 11 } }, grid: { color: 'oklch(0.20 0.02 265)' } },
                },
              }} />
            )}
          </div>

          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Crypto Holdings</h3>
              <Link to="/crypto" style={{ fontSize: '0.75rem', color: 'var(--brand-light)', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cryptoHoldings.map((c) => (
                <div key={c.symbol} className="glass-card-2" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: c.color + ' / 0.2', border: `1px solid ${c.color} / 0.3`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: c.color }}>
                      {c.symbol.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.symbol}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{c.amount.toFixed(4)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>${c.value.toLocaleString()}</div>
                    <div style={{ fontSize: '0.72rem', color: c.change >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                      {c.change >= 0 ? '+' : ''}{c.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/crypto" className="btn btn-secondary" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}>
              <Bitcoin size={14} /> Manage Crypto
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ fontSize: '0.8rem', color: 'var(--brand-light)', textDecoration: 'none' }}>View all</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.1rem' }}>{tx.icon}</span>
                      <span style={{ fontWeight: 500 }}>{tx.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td>
                    <span className={`badge ${tx.type === 'credit' ? 'badge-success' : tx.type === 'crypto' ? 'badge-info' : 'badge-pending'}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: tx.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Send Money', icon: Send, to: '/transfers', color: 'oklch(0.56 0.24 265)' },
              { label: 'Deposit Check', icon: Download, to: '/deposit', color: 'oklch(0.65 0.18 145)' },
              { label: 'Buy Crypto', icon: Bitcoin, to: '/crypto', color: 'oklch(0.74 0.17 75)' },
              { label: 'Pay Bills', icon: CreditCard, to: '/bills', color: 'oklch(0.60 0.20 290)' },
            ].map((a) => (
              <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
                <div className="glass-card-2" style={{ padding: '16px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color + ' / 0.4' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--surface-border)' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: a.color + ' / 0.15', border: `1px solid ${a.color} / 0.3`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <a.icon size={18} style={{ color: a.color }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{a.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
