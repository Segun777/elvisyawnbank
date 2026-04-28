import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye, Shield, Download } from 'lucide-react'

export const Route = createFileRoute('/admin/transactions')({
  component: AdminTransactions,
})

function generateCode(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

const transactions = [
  { id: 'TXN-001', user: 'John Doe', type: 'wire', from: 'Checking ••••4821', to: 'External — Chase', amount: 45000, date: 'Apr 28, 2026 10:14', status: 'pending_approval', riskFlag: true },
  { id: 'TXN-002', user: 'Alice Thompson', type: 'ach', from: 'Checking ••••9821', to: 'Wells Fargo ••••5511', amount: 2500, date: 'Apr 28, 2026 09:30', status: 'completed', riskFlag: false },
  { id: 'TXN-003', user: 'Sarah Kim', type: 'crypto', from: 'Crypto Wallet', to: 'External BTC Addr', amount: 8200, date: 'Apr 27, 2026 15:42', status: 'pending_approval', riskFlag: true },
  { id: 'TXN-004', user: 'David Brown', type: 'internal', from: 'Checking ••••7721', to: 'Savings ••••9911', amount: 1000, date: 'Apr 27, 2026 11:20', status: 'completed', riskFlag: false },
  { id: 'TXN-005', user: 'James Wilson', type: 'international', from: 'Checking ••••3310', to: 'International — SWIFT', amount: 9800, date: 'Apr 26, 2026 08:55', status: 'under_review', riskFlag: true },
  { id: 'TXN-006', user: 'Robert Martinez', type: 'ach', from: 'Checking ••••5522', to: 'Citibank ••••7788', amount: 500, date: 'Apr 26, 2026 14:10', status: 'completed', riskFlag: false },
]

function AdminTransactions() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof transactions[0] | null>(null)
  const [generatedCodes, setGeneratedCodes] = useState<Record<string, ReturnType<typeof generateAllCodes>>>({})
  const [approvedTxns, setApprovedTxns] = useState<Set<string>>(new Set())

  function generateAllCodes() {
    return {
      ref: generateCode('EYB'),
      coc: generateCode('COC'),
      vat: generateCode('VAT'),
      auth: generateCode('AUTH'),
      compliance: generateCode('COMP'),
    }
  }

  const handleApprove = (id: string) => {
    const codes = generateAllCodes()
    setGeneratedCodes(prev => ({ ...prev, [id]: codes }))
    setApprovedTxns(prev => new Set([...prev, id]))
  }

  const txTypes: Record<string, { label: string, color: string }> = {
    wire: { label: 'Wire', color: 'var(--brand-light)' },
    ach: { label: 'ACH', color: 'var(--success)' },
    crypto: { label: 'Crypto', color: 'var(--gold)' },
    internal: { label: 'Internal', color: 'var(--text-secondary)' },
    international: { label: 'Intl', color: 'oklch(0.74 0.18 290)' },
  }

  const filtered = transactions.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction Management</h1>
          <p className="page-subtitle">Monitor, approve, and generate verification codes</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Pending Approval', value: '2', color: 'var(--warning)' },
            { label: 'Under Review', value: '1', color: 'oklch(0.74 0.18 290)' },
            { label: 'Completed Today', value: '89', color: 'var(--success)' },
            { label: 'Flagged', value: '3', color: 'var(--danger)' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Search */}
            <div className="glass-card" style={{ padding: '12px 16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 34 }} placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 22 }}>Transaction</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Risk</th>
                    <th>Status</th>
                    <th style={{ paddingRight: 22 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected?.id === tx.id ? null : tx)}>
                      <td style={{ paddingLeft: 22, fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600 }}>{tx.id}</td>
                      <td style={{ fontWeight: 500 }}>{tx.user}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: txTypes[tx.type]?.color }}>{txTypes[tx.type]?.label}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: tx.amount > 10000 ? 'var(--warning)' : 'var(--text-primary)' }}>
                        ${tx.amount.toLocaleString()}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{tx.date}</td>
                      <td>
                        {tx.riskFlag ? <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>⚠ Flagged</span> : <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>✓ Clear</span>}
                      </td>
                      <td>
                        <span className={`badge ${
                          approvedTxns.has(tx.id) ? 'badge-success' :
                          tx.status === 'completed' ? 'badge-success' :
                          tx.status === 'pending_approval' ? 'badge-pending' : 'badge-review'
                        }`}>
                          {approvedTxns.has(tx.id) ? 'approved' : tx.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ paddingRight: 22 }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(tx) }}><Eye size={12} /></button>
                          {(tx.status === 'pending_approval' || tx.status === 'under_review') && !approvedTxns.has(tx.id) && (
                            <button className="btn btn-success btn-sm" onClick={(e) => { e.stopPropagation(); handleApprove(tx.id) }}>
                              <CheckCircle size={12} /> Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail / verification codes panel */}
          {selected && (
            <div className="glass-card" style={{ padding: 22, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Transaction Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>${selected.amount.toLocaleString()}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>{selected.user} · {selected.id}</div>
              {[
                ['From', selected.from],
                ['To', selected.to],
                ['Type', txTypes[selected.type]?.label],
                ['Date', selected.date],
                ['Risk Flag', selected.riskFlag ? '⚠ Yes' : '✓ No'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}

              {generatedCodes[selected.id] && (
                <div style={{ marginTop: 16, background: 'oklch(0.13 0.02 265)', borderRadius: 10, padding: 14, fontFamily: 'monospace', fontSize: '0.75rem', border: '1px solid oklch(0.56 0.24 265 / 0.3)' }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>═ VERIFICATION CODES GENERATED ═</div>
                  {Object.entries(generatedCodes[selected.id]).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{k}:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.72rem' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'var(--text-muted)' }}>Codes sent to customer email automatically</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                {(selected.status === 'pending_approval' || selected.status === 'under_review') && !approvedTxns.has(selected.id) && (
                  <>
                    <button className="btn btn-success" style={{ justifyContent: 'center' }} onClick={() => handleApprove(selected.id)}>
                      <CheckCircle size={14} /> Approve & Generate Codes
                    </button>
                    <button className="btn btn-danger" style={{ justifyContent: 'center' }}>
                      <XCircle size={14} /> Reject Transaction
                    </button>
                  </>
                )}
                <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <Shield size={14} /> Generate Verification Codes
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <Download size={14} /> Download Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
