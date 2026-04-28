import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreditCard, Plus, Freeze, Eye, EyeOff, Lock, Unlock, Settings, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/_banking/cards')({
  component: Cards,
})

const userCards = [
  { id: 1, type: 'Virtual', label: 'Online Shopping', number: '4821 •••• •••• 7723', expiry: '04/29', cvv: '•••', limit: 5000, spent: 1240, frozen: false, color: 'gradient-brand', textDark: false },
  { id: 2, type: 'Debit', label: 'Main Debit Card', number: '4821 •••• •••• 4821', expiry: '08/28', cvv: '•••', limit: 10000, spent: 3200, frozen: false, color: 'gradient-gold', textDark: true },
  { id: 3, type: 'Virtual', label: 'Subscriptions', number: '4821 •••• •••• 1199', expiry: '12/26', cvv: '•••', limit: 200, spent: 47.98, frozen: true, color: 'gradient-dark', textDark: false },
]

function Cards() {
  const [cards, setCards] = useState(userCards)
  const [showDetails, setShowDetails] = useState<number | null>(null)
  const [activeCard, setActiveCard] = useState(0)

  const toggleFreeze = (id: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c))
  }

  const card = cards[activeCard]

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cards</h1>
          <p className="page-subtitle">Manage your debit and virtual cards</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={14} /> New Virtual Card
        </button>
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Card list + controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card selector */}
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {cards.map((c, i) => (
              <div
                key={c.id}
                className={`bank-card ${c.color}`}
                style={{
                  width: 280, flexShrink: 0, cursor: 'pointer',
                  opacity: activeCard === i ? 1 : 0.6,
                  transform: activeCard === i ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.2s',
                  boxShadow: activeCard === i ? '0 12px 32px oklch(0.56 0.24 265 / 0.35)' : 'none',
                  filter: c.frozen ? 'grayscale(0.6)' : 'none',
                }}
                onClick={() => setActiveCard(i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.type}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 1 }}>{c.label}</div>
                  </div>
                  {c.frozen && <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem' }}>FROZEN</span>}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', color: c.textDark ? 'oklch(0.10 0.02 265)' : 'white' }}>
                  {showDetails === c.id ? c.number : '•••• •••• •••• ' + c.number.split(' ').pop()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7, color: c.textDark ? 'oklch(0.10 0.02 265)' : undefined }}>
                    Exp {c.expiry}
                  </div>
                  <CreditCard size={18} style={{ opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Active card controls */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{card.label}</h3>
              <span className={`badge ${card.frozen ? 'badge-danger' : 'badge-success'}`}>{card.frozen ? 'Frozen' : 'Active'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Spending Limit', value: `$${card.limit.toLocaleString()}` },
                { label: 'Spent This Month', value: `$${card.spent.toLocaleString()}` },
                { label: 'Available', value: `$${(card.limit - card.spent).toLocaleString()}` },
                { label: 'Card Type', value: card.type },
              ].map((s) => (
                <div key={s.label} className="glass-card-2" style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>Monthly spend</span>
                <span>{Math.round((card.spent / card.limit) * 100)}% of limit</span>
              </div>
              <div style={{ height: 6, background: 'oklch(0.20 0.02 265)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(card.spent / card.limit) * 100}%`, background: 'linear-gradient(90deg, oklch(0.56 0.24 265), oklch(0.65 0.18 145))', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: card.frozen ? 'Unfreeze' : 'Freeze', icon: card.frozen ? Unlock : Lock, action: () => toggleFreeze(card.id), color: card.frozen ? 'var(--success)' : 'var(--warning)' },
                { label: showDetails === card.id ? 'Hide' : 'Show Details', icon: showDetails === card.id ? EyeOff : Eye, action: () => setShowDetails(showDetails === card.id ? null : card.id), color: 'var(--brand-light)' },
                { label: 'Set Limit', icon: Settings, action: () => {}, color: 'var(--text-secondary)' },
                { label: 'Replace', icon: RefreshCw, action: () => {}, color: 'var(--text-secondary)' },
              ].map((a) => (
                <button key={a.label} className="btn btn-secondary" style={{ flexDirection: 'column', padding: '12px 8px', height: 72, justifyContent: 'center', gap: 6 }} onClick={a.action}>
                  <a.icon size={16} style={{ color: a.color }} />
                  <span style={{ fontSize: '0.72rem' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card details (if shown) */}
          {showDetails === card.id && (
            <div className="glass-card" style={{ padding: 20, border: '1px solid oklch(0.56 0.24 265 / 0.3)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700 }}>Card Details</h3>
              {[
                ['Card Number', card.number],
                ['Expiry Date', card.expiry],
                ['CVV', '427'],
                ['Billing Address', '123 Main St, New York, NY 10001'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontFamily: k === 'Card Number' || k === 'CVV' ? 'monospace' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Card Controls</h3>
            {[
              { label: 'Online purchases', enabled: true },
              { label: 'International transactions', enabled: false },
              { label: 'ATM withdrawals', enabled: true },
              { label: 'Contactless payments', enabled: true },
              { label: 'Recurring charges', enabled: true },
            ].map((c) => (
              <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)' }}>
                <span style={{ fontSize: '0.83rem' }}>{c.label}</span>
                <div style={{
                  width: 38, height: 20, borderRadius: 10, cursor: 'pointer',
                  background: c.enabled ? 'oklch(0.58 0.18 145 / 0.4)' : 'oklch(0.25 0.03 265)',
                  border: `1px solid ${c.enabled ? 'oklch(0.58 0.18 145 / 0.5)' : 'var(--surface-border)'}`,
                  position: 'relative', display: 'flex', alignItems: 'center', padding: '0 2px',
                  justifyContent: c.enabled ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: c.enabled ? 'var(--success)' : 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Generate One-Time Card</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              Create a temporary virtual card for a single purchase. Expires after use.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input" placeholder="Spending limit (e.g. $50)" />
              <select className="input">
                <option>Expires after 1 use</option>
                <option>Expires in 24 hours</option>
                <option>Expires in 7 days</option>
              </select>
              <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
                <Plus size={14} /> Generate Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
