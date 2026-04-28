import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Users, DollarSign, AlertTriangle, Camera, TrendingUp, ArrowUpRight, Shield, Activity } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

const txVolumeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Deposits ($k)',
      data: [820, 950, 880, 1120],
      backgroundColor: 'oklch(0.56 0.24 265 / 0.7)',
      borderRadius: 6,
    },
    {
      label: 'Withdrawals ($k)',
      data: [510, 620, 580, 740],
      backgroundColor: 'oklch(0.52 0.22 25 / 0.6)',
      borderRadius: 6,
    },
  ],
}

const recentAlerts = [
  { id: 1, type: 'fraud', message: 'Suspicious login attempt — User #1042', time: '2 min ago', level: 'high' },
  { id: 2, type: 'deposit', message: 'Large check deposit pending review — $8,000', time: '15 min ago', level: 'medium' },
  { id: 3, type: 'transfer', message: 'Large wire transfer requires approval — $45,000', time: '1 hr ago', level: 'medium' },
  { id: 4, type: 'kyc', message: 'KYC documents expired — 3 users', time: '2 hr ago', level: 'low' },
]

const recentSignups = [
  { name: 'Alice Thompson', email: 'alice@email.com', date: 'Apr 28', kyc: 'verified', status: 'active' },
  { name: 'Robert Martinez', email: 'robert@email.com', date: 'Apr 27', kyc: 'pending', status: 'pending' },
  { name: 'Sarah Kim', email: 'sarah@email.com', date: 'Apr 27', kyc: 'verified', status: 'active' },
  { name: 'James Wilson', email: 'james@email.com', date: 'Apr 26', kyc: 'review', status: 'pending' },
]

function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Overview</h1>
          <p className="page-subtitle">Elvis Yawn Bank — Management Dashboard · April 28, 2026</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Customers', value: '8,421', change: '+124 this week', icon: Users, color: 'var(--brand-light)', link: '/admin/users' },
            { label: 'Total Deposits', value: '$12.4M', change: '+8.2% this month', icon: DollarSign, color: 'var(--success)', link: '/admin/deposits' },
            { label: 'Active Transactions', value: '1,840', change: '+42 today', icon: Activity, color: 'var(--gold)', link: '/admin/transactions' },
            { label: 'Fraud Alerts', value: '7', change: '2 high priority', icon: AlertTriangle, color: 'var(--danger)', link: '/admin/transactions' },
          ].map((s) => (
            <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{s.change}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Chart + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Transaction Volume — 2026</h3>
            {mounted && (
              <Bar data={txVolumeData} options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: 'oklch(0.65 0.04 265)', font: { size: 11 } } },
                },
                scales: {
                  x: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } },
                  y: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } },
                },
              }} />
            )}
          </div>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Security Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentAlerts.map((a) => (
                <div key={a.id} className="glass-card-2" style={{ padding: '10px 12px', borderLeft: `3px solid ${a.level === 'high' ? 'var(--danger)' : a.level === 'medium' ? 'var(--warning)' : 'var(--text-muted)'}` }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>{a.message}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>{a.time}</span>
                    <span className={`badge ${a.level === 'high' ? 'badge-danger' : a.level === 'medium' ? 'badge-pending' : 'badge-info'}`}>{a.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick admin actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Review Check Deposits', sub: '3 pending', color: 'oklch(0.56 0.24 265)', to: '/admin/deposits' },
            { label: 'Approve Transfers', sub: '1 large wire', color: 'var(--warning)', to: '/admin/transactions' },
            { label: 'KYC Review', sub: '7 pending', color: 'var(--gold)', to: '/admin/users' },
            { label: 'Freeze Suspicious Account', sub: '2 flagged', color: 'var(--danger)', to: '/admin/users' },
          ].map((a) => (
            <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '16px', cursor: 'pointer', borderColor: a.color + ' / 0.3' }}>
                <ArrowUpRight size={16} style={{ color: a.color, marginBottom: 8 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', color: a.color, fontWeight: 600 }}>{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent signups */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recent Signups</h3>
            <Link to="/admin/users" style={{ fontSize: '0.8rem', color: 'var(--brand-light)', textDecoration: 'none' }}>View all</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Signup Date</th>
                <th>KYC</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentSignups.map((u, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.date}</td>
                  <td>
                    <span className={`badge ${u.kyc === 'verified' ? 'badge-success' : u.kyc === 'pending' ? 'badge-pending' : 'badge-review'}`}>{u.kyc}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-pending'}`}>{u.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System status */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 700 }}>System Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { name: 'Banking Core', status: 'operational', uptime: '99.98%' },
              { name: 'Payment Gateway', status: 'operational', uptime: '99.95%' },
              { name: 'Crypto Engine', status: 'operational', uptime: '99.90%' },
              { name: 'Fraud Detection AI', status: 'operational', uptime: '100%' },
              { name: 'Check OCR Service', status: 'operational', uptime: '99.87%' },
              { name: 'Email Service', status: 'degraded', uptime: '98.20%' },
              { name: 'KYC Verification', status: 'operational', uptime: '99.92%' },
              { name: 'Mobile API', status: 'operational', uptime: '99.99%' },
            ].map((s) => (
              <div key={s.name} className="glass-card-2" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uptime: {s.uptime}</div>
                </div>
                <span className={`badge ${s.status === 'operational' ? 'badge-success' : 'badge-pending'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
