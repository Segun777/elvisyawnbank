import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Zap, Wifi, Phone, Home, Car, CreditCard, FileText, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_banking/bills')({
  component: Bills,
})

const billCategories = [
  { id: 'utility', label: 'Utilities', icon: Zap, color: 'oklch(0.78 0.17 85)' },
  { id: 'internet', label: 'Internet / TV', icon: Wifi, color: 'oklch(0.60 0.20 265)' },
  { id: 'phone', label: 'Phone / Airtime', icon: Phone, color: 'oklch(0.65 0.18 145)' },
  { id: 'rent', label: 'Rent / Mortgage', icon: Home, color: 'oklch(0.74 0.17 75)' },
  { id: 'insurance', label: 'Insurance', icon: Car, color: 'oklch(0.60 0.22 25)' },
  { id: 'subscription', label: 'Subscriptions', icon: CreditCard, color: 'oklch(0.60 0.20 290)' },
]

const scheduledBills = [
  { name: 'Electric Bill', provider: 'City Power', amount: 87.50, dueDate: 'May 1, 2026', status: 'upcoming', category: 'Utilities', autopay: true },
  { name: 'Internet', provider: 'Comcast', amount: 64.99, dueDate: 'May 5, 2026', status: 'upcoming', category: 'Internet', autopay: true },
  { name: 'Phone Plan', provider: 'AT&T', amount: 45.00, dueDate: 'May 8, 2026', status: 'upcoming', category: 'Phone', autopay: false },
  { name: 'Rent', provider: 'Parkview Apartments', amount: 1800.00, dueDate: 'May 1, 2026', status: 'upcoming', category: 'Rent', autopay: true },
  { name: 'Netflix', provider: 'Netflix', amount: 15.99, dueDate: 'Apr 30, 2026', status: 'overdue', category: 'Subscription', autopay: false },
  { name: 'Car Insurance', provider: 'State Farm', amount: 120.00, dueDate: 'May 15, 2026', status: 'upcoming', category: 'Insurance', autopay: true },
]

function Bills() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [paySuccess, setPaySuccess] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState('')

  const handlePay = (name: string) => {
    setPaySuccess(name)
    setTimeout(() => setPaySuccess(null), 3000)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bill Pay</h1>
          <p className="page-subtitle">Pay bills, utilities, and subscriptions</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Category selector */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Pay a Bill</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
            {billCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                style={{
                  background: selectedCategory === c.id ? c.color + ' / 0.18' : 'oklch(0.16 0.02 265 / 0.8)',
                  border: `1px solid ${selectedCategory === c.id ? c.color + ' / 0.4' : 'var(--surface-border)'}`,
                  borderRadius: 12, padding: '14px 10px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                  transition: 'all 0.15s',
                }}
              >
                <c.icon size={20} style={{ color: selectedCategory === c.id ? c.color : 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: selectedCategory === c.id ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>{c.label}</span>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: '16px 0', borderTop: '1px solid var(--surface-border)' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Provider / Biller</label>
                <input className="input" placeholder="Enter provider name" value={provider} onChange={(e) => setProvider(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Account / Reference</label>
                <input className="input" placeholder="Account or reference number" />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>$</span>
                  <input className="input" style={{ paddingLeft: 26 }} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Pay From</label>
                <select className="input">
                  <option>Checking — ••••4821 ($24,850)</option>
                  <option>Savings — ••••7293 ($48,200)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Payment Date</label>
                <input className="input" type="date" defaultValue="2026-04-28" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handlePay(provider || selectedCategory)}
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success toast */}
        {paySuccess && (
          <div style={{ background: 'oklch(0.58 0.18 145 / 0.15)', border: '1px solid oklch(0.58 0.18 145 / 0.4)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Payment sent successfully!</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>A receipt with verification codes has been emailed to you.</span>
          </div>
        )}

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Due This Month', value: '$2,133.48', color: 'var(--warning)' },
            { label: 'Autopay Enabled', value: '4 bills', color: 'var(--success)' },
            { label: 'Overdue', value: '1 bill', color: 'var(--danger)' },
            { label: 'Paid This Month', value: '$1,240.50', color: 'var(--brand-light)' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Scheduled bills */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Upcoming Bills</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 22 }}>Bill</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Autopay</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: 22 }}>Amount</th>
                <th style={{ paddingRight: 22 }}></th>
              </tr>
            </thead>
            <tbody>
              {scheduledBills.map((b, i) => (
                <tr key={i}>
                  <td style={{ paddingLeft: 22, fontWeight: 600 }}>{b.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{b.provider}</td>
                  <td><span className="badge badge-info">{b.category}</span></td>
                  <td style={{ color: b.status === 'overdue' ? 'var(--danger)' : 'var(--text-secondary)' }}>{b.dueDate}</td>
                  <td>
                    <span className={`badge ${b.autopay ? 'badge-success' : 'badge-pending'}`}>{b.autopay ? 'Auto' : 'Manual'}</span>
                  </td>
                  <td>
                    <span className={`badge ${b.status === 'upcoming' ? 'badge-info' : 'badge-danger'}`}>{b.status}</span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: 4, fontWeight: 700 }}>${b.amount.toFixed(2)}</td>
                  <td style={{ paddingRight: 22 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handlePay(b.name)}>Pay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
