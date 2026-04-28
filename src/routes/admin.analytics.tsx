import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

export const Route = createFileRoute('/admin/analytics')({
  component: AdminAnalytics,
})

const userGrowthData = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{
    label: 'New Users',
    data: [420, 580, 790, 1020, 1340, 1680, 2210],
    borderColor: 'oklch(0.56 0.24 265)',
    backgroundColor: 'oklch(0.56 0.24 265 / 0.1)',
    fill: true, tension: 0.4, pointRadius: 4,
    pointBackgroundColor: 'oklch(0.56 0.24 265)',
  }],
}

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    { label: 'Fee Revenue', data: [28000, 35000, 42000, 51000], backgroundColor: 'oklch(0.56 0.24 265 / 0.7)', borderRadius: 6 },
    { label: 'Interest Income', data: [18000, 22000, 26000, 31000], backgroundColor: 'oklch(0.65 0.18 145 / 0.7)', borderRadius: 6 },
  ],
}

const txTypePie = {
  labels: ['ACH', 'Wire', 'Internal', 'International', 'Crypto'],
  datasets: [{
    data: [42, 18, 22, 8, 10],
    backgroundColor: ['oklch(0.56 0.24 265 / 0.8)', 'oklch(0.65 0.18 145 / 0.8)', 'oklch(0.74 0.17 75 / 0.8)', 'oklch(0.60 0.20 290 / 0.8)', 'oklch(0.62 0.20 45 / 0.8)'],
    borderWidth: 0,
  }],
}

function AdminAnalytics() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Platform-wide metrics and insights</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Customers', value: '8,421', change: '+18.4%', icon: Users, color: 'var(--brand-light)' },
            { label: 'Platform AUM', value: '$56.2M', change: '+12.1%', icon: DollarSign, color: 'var(--gold)' },
            { label: 'Monthly Revenue', value: '$82,000', change: '+21.4%', icon: TrendingUp, color: 'var(--success)' },
            { label: 'Daily Transactions', value: '1,840', change: '+8.2%', icon: Activity, color: 'oklch(0.74 0.18 290)' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>↑ {s.change} MoM</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>User Growth</h3>
            {mounted && <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { labels: { color: 'oklch(0.65 0.04 265)' } } }, scales: { x: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } }, y: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } } } }} />}
          </div>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Revenue Breakdown</h3>
            {mounted && <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { labels: { color: 'oklch(0.65 0.04 265)' } } }, scales: { x: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } }, y: { ticks: { color: 'oklch(0.50 0.03 265)' }, grid: { color: 'oklch(0.20 0.02 265)' } } } }} />}
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Transfer Types</h3>
            {mounted && <Doughnut data={txTypePie} options={{ responsive: true, plugins: { legend: { labels: { color: 'oklch(0.65 0.04 265)' } } } }} />}
          </div>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Platform Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Check Deposits', value: '847', sub: 'This month', color: 'var(--brand-light)' },
                { label: 'Crypto Volume', value: '$4.2M', sub: '30-day', color: 'var(--gold)' },
                { label: 'Fraud Prevented', value: '$128K', sub: 'Blocked', color: 'var(--danger)' },
                { label: 'Auto-Approvals', value: '94.2%', sub: 'AI-approved', color: 'var(--success)' },
                { label: 'Avg. Response', value: '1.4s', sub: 'API latency', color: 'oklch(0.74 0.18 290)' },
                { label: 'Compliance Rate', value: '99.8%', sub: 'AML/KYC', color: 'var(--success)' },
                { label: 'Active Users', value: '6,814', sub: 'Last 30 days', color: 'var(--brand-light)' },
                { label: 'Bill Payments', value: '2,140', sub: 'This month', color: 'var(--text-secondary)' },
                { label: 'NPS Score', value: '78', sub: 'Customer sat', color: 'var(--success)' },
              ].map((m) => (
                <div key={m.label} className="glass-card-2" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: m.color, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
