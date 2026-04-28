import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/_banking/transactions')({
  component: Transactions,
})

const allTransactions = [
  { id: 'TXN-001', name: 'Salary Deposit — ABC Corp', type: 'credit', amount: 5400.00, date: 'Apr 25, 2026', account: 'Checking', category: 'Income', status: 'completed', ref: 'REF-2026-04250001' },
  { id: 'TXN-002', name: 'Amazon Purchase', type: 'debit', amount: -124.99, date: 'Apr 27, 2026', account: 'Checking', category: 'Shopping', status: 'completed', ref: 'REF-2026-04270002' },
  { id: 'TXN-003', name: 'Netflix Subscription', type: 'debit', amount: -15.99, date: 'Apr 24, 2026', account: 'Checking', category: 'Subscription', status: 'completed', ref: 'REF-2026-04240003' },
  { id: 'TXN-004', name: 'BTC Purchase', type: 'crypto', amount: -500.00, date: 'Apr 22, 2026', account: 'Checking', category: 'Crypto', status: 'completed', ref: 'REF-2026-04220004' },
  { id: 'TXN-005', name: 'Wire Transfer — Jane Smith', type: 'credit', amount: 300.00, date: 'Apr 21, 2026', account: 'Checking', category: 'Transfer', status: 'completed', ref: 'REF-2026-04210005' },
  { id: 'TXN-006', name: 'Electric Bill — City Power', type: 'debit', amount: -87.50, date: 'Apr 20, 2026', account: 'Checking', category: 'Bills', status: 'completed', ref: 'REF-2026-04200006' },
  { id: 'TXN-007', name: 'Savings Interest', type: 'credit', amount: 204.85, date: 'Apr 18, 2026', account: 'Savings', category: 'Interest', status: 'completed', ref: 'REF-2026-04180007' },
  { id: 'TXN-008', name: 'Mobile Check Deposit', type: 'credit', amount: 1200.00, date: 'Apr 17, 2026', account: 'Checking', category: 'Deposit', status: 'pending', ref: 'REF-2026-04170008' },
  { id: 'TXN-009', name: 'Uber Eats', type: 'debit', amount: -34.20, date: 'Apr 16, 2026', account: 'Checking', category: 'Food', status: 'completed', ref: 'REF-2026-04160009' },
  { id: 'TXN-010', name: 'Zelle — Mike Johnson', type: 'debit', amount: -200.00, date: 'Apr 14, 2026', account: 'Checking', category: 'Transfer', status: 'completed', ref: 'REF-2026-04140010' },
  { id: 'TXN-011', name: 'ETH Sale', type: 'credit', amount: 820.00, date: 'Apr 12, 2026', account: 'Crypto', category: 'Crypto', status: 'completed', ref: 'REF-2026-04120011' },
  { id: 'TXN-012', name: 'Rent Payment', type: 'debit', amount: -1800.00, date: 'Apr 1, 2026', account: 'Checking', category: 'Bills', status: 'completed', ref: 'REF-2026-04010012' },
]

const categories = ['All', 'Income', 'Shopping', 'Bills', 'Transfer', 'Crypto', 'Food', 'Subscription', 'Deposit', 'Interest']

function Transactions() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<typeof allTransactions[0] | null>(null)

  const filtered = allTransactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.ref.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || tx.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Full transaction history across all accounts</p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Filters */}
        <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="btn btn-sm"
                style={{
                  background: category === c ? 'oklch(0.56 0.24 265 / 0.2)' : 'oklch(0.16 0.02 265 / 0.8)',
                  color: category === c ? 'oklch(0.80 0.16 265)' : 'var(--text-secondary)',
                  border: `1px solid ${category === c ? 'oklch(0.56 0.24 265 / 0.4)' : 'var(--surface-border)'}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>
          {/* Table */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Transaction</th>
                  <th>Reference</th>
                  <th>Account</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected?.id === tx.id ? null : tx)}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: tx.type === 'credit' ? 'oklch(0.58 0.18 145 / 0.15)' : tx.type === 'crypto' ? 'oklch(0.62 0.20 45 / 0.15)' : 'oklch(0.18 0.03 265)',
                        }}>
                          {tx.type === 'credit' ? <ArrowDownLeft size={14} style={{ color: 'var(--success)' }} /> : <ArrowUpRight size={14} style={{ color: tx.type === 'crypto' ? 'var(--gold)' : 'var(--text-secondary)' }} />}
                        </div>
                        <span style={{ fontWeight: 500 }}>{tx.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{tx.ref}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.account}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                    <td>
                      <span className={`badge ${tx.status === 'completed' ? 'badge-success' : 'badge-pending'}`}>{tx.status}</span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 20, fontWeight: 700, color: tx.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--surface-border)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Showing {filtered.length} of {allTransactions.length} transactions</span>
              <span>Click a row to view details</span>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="glass-card" style={{ padding: 22, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Transaction Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: selected.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                  {selected.amount > 0 ? '+' : ''}{selected.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{selected.name}</div>
                <div className="divider" />
                {[
                  ['Transaction ID', selected.id],
                  ['Reference', selected.ref],
                  ['Date', selected.date],
                  ['Account', selected.account],
                  ['Category', selected.category],
                  ['Status', selected.status],
                  ['Type', selected.type === 'credit' ? 'Credit / Incoming' : selected.type === 'debit' ? 'Debit / Outgoing' : 'Crypto'],
                  ['COC Code', 'COC-' + selected.id + '-2026'],
                  ['Auth Number', 'AUTH-' + Math.random().toString(36).substr(2, 8).toUpperCase()],
                  ['Compliance', 'CLEARED'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{v}</span>
                  </div>
                ))}
                <button className="btn btn-secondary" style={{ marginTop: 8, justifyContent: 'center' }}>
                  <Download size={13} /> Download Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
