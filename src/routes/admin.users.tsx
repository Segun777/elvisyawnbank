import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, UserCheck, UserX, Eye, AlertTriangle, Download } from 'lucide-react'

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
})

const users = [
  { id: 'USR-001', name: 'John Doe', email: 'john@email.com', phone: '+1 555-0101', balance: 73050, joined: 'Jan 12, 2026', kyc: 'verified', status: 'active', riskScore: 12, accounts: 3, lastLogin: '2 hr ago' },
  { id: 'USR-002', name: 'Alice Thompson', email: 'alice@email.com', phone: '+1 555-0202', balance: 18400, joined: 'Apr 28, 2026', kyc: 'verified', status: 'active', riskScore: 8, accounts: 1, lastLogin: '5 min ago' },
  { id: 'USR-003', name: 'Robert Martinez', email: 'robert@email.com', phone: '+1 555-0303', balance: 0, joined: 'Apr 27, 2026', kyc: 'pending', status: 'pending', riskScore: 45, accounts: 0, lastLogin: '1 day ago' },
  { id: 'USR-004', name: 'Sarah Kim', email: 'sarah@email.com', phone: '+1 555-0404', balance: 9820, joined: 'Apr 27, 2026', kyc: 'verified', status: 'active', riskScore: 5, accounts: 2, lastLogin: '10 min ago' },
  { id: 'USR-005', name: 'James Wilson', email: 'james@email.com', phone: '+1 555-0505', balance: 3200, joined: 'Apr 26, 2026', kyc: 'review', status: 'pending', riskScore: 72, accounts: 1, lastLogin: '3 hr ago' },
  { id: 'USR-006', name: 'Maria Garcia', email: 'maria@email.com', phone: '+1 555-0606', balance: 52100, joined: 'Mar 5, 2026', kyc: 'verified', status: 'frozen', riskScore: 88, accounts: 2, lastLogin: '2 days ago' },
  { id: 'USR-007', name: 'David Brown', email: 'david@email.com', phone: '+1 555-0707', balance: 6800, joined: 'Feb 18, 2026', kyc: 'verified', status: 'active', riskScore: 15, accounts: 1, lastLogin: '1 hr ago' },
]

function AdminUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<typeof users[0] | null>(null)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter || u.kyc === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">View, approve, and manage all customer accounts</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Filters */}
        <div className="glass-card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 34 }} placeholder="Search by name, email, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {['all', 'active', 'pending', 'frozen', 'verified', 'review'].map((f) => (
            <button key={f} className="btn btn-sm" style={{ background: filter === f ? 'oklch(0.56 0.24 265 / 0.2)' : 'oklch(0.16 0.02 265 / 0.8)', color: filter === f ? 'oklch(0.80 0.16 265)' : 'var(--text-secondary)', border: `1px solid ${filter === f ? 'oklch(0.56 0.24 265 / 0.4)' : 'var(--surface-border)'}`, textTransform: 'capitalize' }} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>Customer</th>
                  <th>Balance</th>
                  <th>KYC</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                  <th>Last Login</th>
                  <th style={{ paddingRight: 22 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(selected?.id === u.id ? null : u)}>
                    <td style={{ paddingLeft: 22 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>${u.balance.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${u.kyc === 'verified' ? 'badge-success' : u.kyc === 'pending' ? 'badge-pending' : 'badge-review'}`}>{u.kyc}</span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : u.status === 'frozen' ? 'badge-danger' : 'badge-pending'}`}>{u.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'oklch(0.20 0.02 265)', borderRadius: 3, overflow: 'hidden', maxWidth: 60 }}>
                          <div style={{ height: '100%', width: `${u.riskScore}%`, background: u.riskScore > 60 ? 'var(--danger)' : u.riskScore > 30 ? 'var(--warning)' : 'var(--success)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: u.riskScore > 60 ? 'var(--danger)' : u.riskScore > 30 ? 'var(--warning)' : 'var(--success)' }}>{u.riskScore}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.lastLogin}</td>
                    <td style={{ paddingRight: 22 }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(u) }}><Eye size={12} /></button>
                        {u.status === 'active' ? (
                          <button className="btn btn-danger btn-sm" onClick={(e) => e.stopPropagation()}><UserX size={12} /> Freeze</button>
                        ) : u.status === 'frozen' ? (
                          <button className="btn btn-success btn-sm" onClick={(e) => e.stopPropagation()}><UserCheck size={12} /> Unfreeze</button>
                        ) : (
                          <button className="btn btn-success btn-sm" onClick={(e) => e.stopPropagation()}><UserCheck size={12} /> Approve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 22px', borderTop: '1px solid var(--surface-border)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing {filtered.length} of {users.length} customers
            </div>
          </div>

          {selected && (
            <div className="glass-card" style={{ padding: 22, height: 'fit-content' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Customer Profile</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: '0 auto 10px' }}>
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{selected.id}</div>
              </div>
              {[
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Balance', `$${selected.balance.toLocaleString()}`],
                ['Accounts', selected.accounts],
                ['Joined', selected.joined],
                ['KYC Status', selected.kyc],
                ['Account Status', selected.status],
                ['Risk Score', `${selected.riskScore}/100`],
                ['Last Login', selected.lastLogin],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>View Full History</button>
                {selected.status === 'active' ? (
                  <button className="btn btn-danger" style={{ justifyContent: 'center' }}><UserX size={14} /> Freeze Account</button>
                ) : (
                  <button className="btn btn-success" style={{ justifyContent: 'center' }}><UserCheck size={14} /> Activate Account</button>
                )}
                {selected.riskScore > 60 && (
                  <button className="btn" style={{ justifyContent: 'center', background: 'oklch(0.74 0.17 85 / 0.15)', color: 'var(--warning)', border: '1px solid oklch(0.74 0.17 85 / 0.3)' }}>
                    <AlertTriangle size={14} /> Flag for Review
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
