import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle, XCircle, Eye, RefreshCw, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/admin/deposits')({
  component: AdminDeposits,
})

const pendingDeposits = [
  { id: 'CHK-001', user: 'John Doe', userId: 'USR-001', amount: 1200.00, bank: 'JPMorgan Chase', routing: '021000021', memo: 'April rent refund', submitted: 'Apr 17, 2026 09:42', aiScore: 98.4, aiVerdict: 'pass', duplicate: false, status: 'pending' },
  { id: 'CHK-004', user: 'James Wilson', userId: 'USR-005', amount: 8000.00, bank: 'Unknown', routing: 'Unknown', memo: 'Business payment', submitted: 'Mar 28, 2026 14:20', aiScore: 43.2, aiVerdict: 'suspicious', duplicate: false, status: 'review' },
  { id: 'CHK-008', user: 'Alice Thompson', userId: 'USR-002', amount: 550.00, bank: 'Wells Fargo', routing: '121000248', memo: 'Freelance work', submitted: 'Apr 27, 2026 11:15', aiScore: 96.8, aiVerdict: 'pass', duplicate: false, status: 'pending' },
]

const depositHistory = [
  { id: 'CHK-002', user: 'John Doe', amount: 3500, date: 'Apr 10, 2026', status: 'approved', reviewer: 'Auto-Approved' },
  { id: 'CHK-003', user: 'Sarah Kim', amount: 250, date: 'Apr 5, 2026', status: 'approved', reviewer: 'Admin SA' },
  { id: 'CHK-005', user: 'Robert Martinez', amount: 500, date: 'Mar 20, 2026', status: 'rejected', reviewer: 'Admin SA' },
  { id: 'CHK-006', user: 'Maria Garcia', amount: 12000, date: 'Mar 15, 2026', status: 'approved', reviewer: 'Admin SA' },
]

function AdminDeposits() {
  const [deposits, setDeposits] = useState(pendingDeposits)
  const [selected, setSelected] = useState<typeof pendingDeposits[0] | null>(null)
  const [actionDone, setActionDone] = useState<string | null>(null)

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setDeposits(prev => prev.filter(d => d.id !== id))
    setActionDone(`${id} ${action}`)
    setSelected(null)
    setTimeout(() => setActionDone(null), 3000)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Check Deposit Management</h1>
          <p className="page-subtitle">Review, approve, or reject mobile check deposits</p>
        </div>
        <button className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {actionDone && (
          <div style={{ background: 'oklch(0.58 0.18 145 / 0.15)', border: '1px solid oklch(0.58 0.18 145 / 0.4)', borderRadius: 12, padding: '12px 18px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>
            ✓ {actionDone} — User balance has been updated automatically.
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Pending Review', value: `${deposits.length}`, color: 'var(--warning)' },
            { label: 'Approved Today', value: '5', color: 'var(--success)' },
            { label: 'Rejected Today', value: '1', color: 'var(--danger)' },
            { label: 'Total Volume', value: '$9,750.00', color: 'var(--brand-light)' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Pending */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Pending Deposits ({deposits.length})</h3>
          {deposits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <CheckCircle size={32} style={{ marginBottom: 10, color: 'var(--success)', display: 'block', margin: '0 auto 10px' }} />
              All deposits reviewed!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deposits.map((d) => (
                <div key={d.id} className="glass-card-2" style={{ padding: 18, cursor: 'pointer', borderColor: selected?.id === d.id ? 'oklch(0.56 0.24 265 / 0.4)' : undefined }} onClick={() => setSelected(selected?.id === d.id ? null : d)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{d.user} · {d.id}</div>
                    </div>
                    <span className={`badge ${d.status === 'pending' ? 'badge-pending' : 'badge-review'}`}>{d.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
                    {[
                      { label: 'Bank', value: d.bank },
                      { label: 'Routing', value: d.routing },
                      { label: 'Memo', value: d.memo },
                      { label: 'Submitted', value: d.submitted },
                    ].map((f) => (
                      <div key={f.label}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: '0.8rem' }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* AI verdict */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: d.aiVerdict === 'pass' ? 'oklch(0.58 0.18 145 / 0.1)' : 'oklch(0.52 0.22 25 / 0.1)', border: `1px solid ${d.aiVerdict === 'pass' ? 'oklch(0.58 0.18 145 / 0.25)' : 'oklch(0.52 0.22 25 / 0.25)'}` }}>
                    {d.aiVerdict === 'pass' ? <CheckCircle size={16} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />}
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: d.aiVerdict === 'pass' ? 'var(--success)' : 'var(--danger)' }}>
                      AI Fraud Score: {d.aiScore}% confidence · {d.aiVerdict === 'pass' ? 'Likely Authentic' : 'Suspicious — Manual Review Recommended'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-success" style={{ justifyContent: 'center', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(d.id, 'approved') }}>
                      <CheckCircle size={14} /> Approve & Credit
                    </button>
                    <button className="btn btn-danger" style={{ justifyContent: 'center', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAction(d.id, 'rejected') }}>
                      <XCircle size={14} /> Reject
                    </button>
                    <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); setSelected(d) }}>
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Deposit History</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 22 }}>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reviewed By</th>
                <th style={{ paddingRight: 22 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {depositHistory.map((d) => (
                <tr key={d.id}>
                  <td style={{ paddingLeft: 22, fontFamily: 'monospace', fontSize: '0.78rem' }}>{d.id}</td>
                  <td style={{ fontWeight: 500 }}>{d.user}</td>
                  <td style={{ fontWeight: 700 }}>${d.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.date}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.reviewer}</td>
                  <td style={{ paddingRight: 22 }}>
                    <span className={`badge ${d.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>{d.status}</span>
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
