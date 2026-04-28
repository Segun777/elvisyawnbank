import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Wallet, TrendingUp, Eye, EyeOff, Plus, RefreshCw, ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_banking/accounts')({
  component: Accounts,
})

const accounts = [
  {
    id: 1, type: 'Checking', number: '•••• 4821', balance: 24850.00,
    available: 24600.00, pending: 250.00, apy: null,
    color: 'gradient-brand', shadow: '0 8px 28px oklch(0.56 0.24 265 / 0.25)',
    status: 'active',
  },
  {
    id: 2, type: 'High-Yield Savings', number: '•••• 7293', balance: 48200.00,
    available: 48200.00, pending: 0, apy: '4.25%',
    color: 'gradient-gold', shadow: '0 8px 28px oklch(0.74 0.17 75 / 0.2)',
    status: 'active',
  },
  {
    id: 3, type: 'Business Checking', number: '•••• 3310', balance: 12400.00,
    available: 12400.00, pending: 0, apy: null,
    color: 'gradient-green', shadow: '0 8px 28px oklch(0.58 0.18 145 / 0.2)',
    status: 'active',
  },
]

const accountActivity = [
  { id: 1, account: 'Checking', txs: 48, income: 10800, expenses: 5600, date: 'April 2026' },
  { id: 2, account: 'Savings', txs: 3, income: 204.85, expenses: 0, date: 'April 2026' },
  { id: 3, account: 'Business', txs: 12, income: 4200, expenses: 2100, date: 'April 2026' },
]

function Accounts() {
  const [hideBalance, setHideBalance] = useState(false)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Accounts</h1>
          <p className="page-subtitle">Manage your bank accounts and balances</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setHideBalance(!hideBalance)}>
            {hideBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            {hideBalance ? 'Show' : 'Hide'} Balances
          </button>
          <button className="btn btn-primary btn-sm">
            <Plus size={14} /> Open Account
          </button>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Account cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {accounts.map((acc) => (
            <div key={acc.id} className={`bank-card ${acc.color}`} style={{ boxShadow: acc.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{acc.type}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: 2 }}>{acc.number}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active</span>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', opacity: 0.75, marginBottom: 4 }}>Total Balance</div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em', color: acc.color === 'gradient-gold' ? 'oklch(0.10 0.02 265)' : 'white' }}>
                  {hideBalance ? '••••••' : `$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.72rem', opacity: 0.7, color: acc.color === 'gradient-gold' ? 'oklch(0.10 0.02 265)' : undefined }}>
                  {acc.apy ? `APY ${acc.apy}` : `Available: ${hideBalance ? '••••' : `$${acc.available.toLocaleString()}`}`}
                </div>
                {acc.pending > 0 && (
                  <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Pending: ${acc.pending}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Assets', value: '$85,450.00', sub: 'All accounts combined', color: 'var(--brand-light)' },
            { label: 'Total Available', value: '$85,200.00', sub: '$250 pending', color: 'var(--success)' },
            { label: 'Monthly Interest', value: '+$204.85', sub: 'Savings earned', color: 'var(--gold)' },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{hideBalance ? '••••••' : s.value}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Activity table */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Account Activity — April 2026</h3>
            <button className="btn btn-secondary btn-sm"><RefreshCw size={13} /> Refresh</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Transactions</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accountActivity.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.account}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.txs} transactions</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>+${a.income.toLocaleString()}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>-${a.expenses.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: (a.income - a.expenses) > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    ${(a.income - a.expenses).toLocaleString()}
                  </td>
                  <td>
                    <Link to="/transactions" className="btn btn-secondary btn-sm">
                      <ArrowUpRight size={12} /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Account Features</h3>
            {['Zero monthly fees', 'FDIC insured up to $250,000', 'No minimum balance', 'Free ACH & wire transfers', 'Instant transfers between accounts', '24/7 fraud monitoring'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.5)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--success) / 0.15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--success)' }}>✓</div>
                <span style={{ fontSize: '0.83rem' }}>{f}</span>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Open a New Account</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'High-Yield Savings', apy: '4.25% APY', desc: 'Earn more on every dollar' },
                { name: 'Money Market', apy: '3.80% APY', desc: 'Flexible access + high yield' },
                { name: 'CD Account', apy: '5.10% APY', desc: '12-month fixed term' },
                { name: 'Business Checking', apy: 'No fees', desc: 'For your business needs' },
              ].map((p) => (
                <div key={p.name} className="glass-card-2" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{p.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-success">{p.apy}</span>
                    <button className="btn btn-secondary btn-sm">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
