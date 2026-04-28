import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Bitcoin, CheckCircle, XCircle, Eye, AlertTriangle, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/admin/crypto')({
  component: AdminCrypto,
})

const cryptoTxs = [
  { id: 'CTXN-001', user: 'John Doe', type: 'withdrawal', asset: 'BTC', amount: 0.02, usdValue: 1254, toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', date: 'Apr 28, 2026', status: 'pending', risk: 'medium' },
  { id: 'CTXN-002', user: 'Sarah Kim', type: 'purchase', asset: 'ETH', amount: 0.5, usdValue: 1469.25, toAddress: 'Internal', date: 'Apr 27, 2026', status: 'completed', risk: 'low' },
  { id: 'CTXN-003', user: 'James Wilson', type: 'withdrawal', asset: 'USDT', amount: 5000, usdValue: 5000, toAddress: 'TN8RUbkTc2oSN...', date: 'Apr 27, 2026', status: 'under_review', risk: 'high' },
  { id: 'CTXN-004', user: 'Alice Thompson', type: 'purchase', asset: 'BTC', amount: 0.05, usdValue: 3135, toAddress: 'Internal', date: 'Apr 26, 2026', status: 'completed', risk: 'low' },
]

const walletSummary = [
  { asset: 'BTC', totalHeld: 2.843, totalValue: 178254.10, users: 142, color: 'oklch(0.74 0.17 75)' },
  { asset: 'ETH', totalHeld: 48.24, totalValue: 141777.84, users: 89, color: 'oklch(0.60 0.20 265)' },
  { asset: 'USDT', totalHeld: 245000, totalValue: 245000, users: 312, color: 'oklch(0.65 0.18 145)' },
  { asset: 'USDC', totalHeld: 98400, totalValue: 98400, users: 204, color: 'oklch(0.56 0.24 265)' },
]

function AdminCrypto() {
  const [txns, setTxns] = useState(cryptoTxs)
  const [selected, setSelected] = useState<typeof cryptoTxs[0] | null>(null)

  const handleApprove = (id: string) => {
    setTxns(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t))
    setSelected(null)
  }

  const handleReject = (id: string) => {
    setTxns(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t))
    setSelected(null)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Crypto Administration</h1>
          <p className="page-subtitle">Manage wallets, review blockchain transfers, compliance</p>
        </div>
        <button className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Wallet summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {walletSummary.map((w) => (
            <div key={w.asset} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{w.asset} Holdings</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: w.color + ' / 0.15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: w.color }}>
                  {w.asset.charAt(0)}
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 2 }}>${w.totalValue.toLocaleString()}</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{w.totalHeld.toLocaleString()} {w.asset} · {w.users} users</div>
            </div>
          ))}
        </div>

        {/* Crypto transactions */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--surface-border)' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Crypto Transactions</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>USD Value</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th style={{ paddingRight: 22 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((tx) => (
                  <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected?.id === tx.id ? null : tx)}>
                    <td style={{ paddingLeft: 22, fontFamily: 'monospace', fontSize: '0.75rem' }}>{tx.id}</td>
                    <td style={{ fontWeight: 500 }}>{tx.user}</td>
                    <td style={{ textTransform: 'capitalize', color: tx.type === 'withdrawal' ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{tx.type}</td>
                    <td style={{ fontWeight: 700 }}>{tx.asset}</td>
                    <td>{tx.amount} {tx.asset}</td>
                    <td style={{ fontWeight: 600 }}>${tx.usdValue.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${tx.risk === 'high' ? 'badge-danger' : tx.risk === 'medium' ? 'badge-pending' : 'badge-success'}`}>{tx.risk}</span>
                    </td>
                    <td>
                      <span className={`badge ${tx.status === 'completed' ? 'badge-success' : tx.status === 'rejected' ? 'badge-danger' : tx.status === 'under_review' ? 'badge-review' : 'badge-pending'}`}>
                        {tx.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ paddingRight: 22 }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(tx) }}><Eye size={12} /></button>
                        {(tx.status === 'pending' || tx.status === 'under_review') && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={(e) => { e.stopPropagation(); handleApprove(tx.id) }}><CheckCircle size={12} /></button>
                            <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleReject(tx.id) }}><XCircle size={12} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="glass-card" style={{ padding: 22, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Crypto TX Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              {[
                ['TX ID', selected.id],
                ['User', selected.user],
                ['Type', selected.type],
                ['Asset', selected.asset],
                ['Amount', `${selected.amount} ${selected.asset}`],
                ['USD Value', `$${selected.usdValue.toLocaleString()}`],
                ['To Address', selected.toAddress],
                ['Date', selected.date],
                ['Risk Level', selected.risk],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%', fontFamily: k === 'To Address' ? 'monospace' : 'inherit', fontSize: k === 'To Address' ? '0.72rem' : 'inherit' }}>{v}</span>
                </div>
              ))}
              {selected.risk === 'high' && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'oklch(0.52 0.22 25 / 0.1)', border: '1px solid oklch(0.52 0.22 25 / 0.25)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--danger)' }}>
                  <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} />
                  High-risk transaction. AML screening flagged. Manual review required.
                </div>
              )}
              {(selected.status === 'pending' || selected.status === 'under_review') && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleApprove(selected.id)}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleReject(selected.id)}>
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
