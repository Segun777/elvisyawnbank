import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import {
  LayoutDashboard, Users, Camera, ArrowLeftRight, Bitcoin,
  Shield, Settings, LogOut, AlertTriangle, BarChart3,
} from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

const adminNav = [
  { to: '/admin/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users', icon: Users, label: 'Customer Management' },
  { to: '/admin/deposits', icon: Camera, label: 'Check Deposits' },
  { to: '/admin/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/admin/crypto', icon: Bitcoin, label: 'Crypto Admin' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

function AdminLayout() {
  return (
    <div className="banking-layout">
      {/* Admin sidebar */}
      <aside className="sidebar" style={{ width: 240, background: 'oklch(0.11 0.025 265)' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, oklch(0.52 0.22 25), oklch(0.50 0.20 10))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Admin Portal</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Secured</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, oklch(0.52 0.22 25), oklch(0.50 0.20 10))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
              SA
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Super Admin</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>admin@elvisyawnbank.com</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '10px 10px', flex: 1 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 4px 8px' }}>Management</div>
          {adminNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
              style={{ marginBottom: 2 }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--surface-border)' }}>
          <Link to="/dashboard" className="nav-link" style={{ marginBottom: 4 }}>
            <LayoutDashboard size={16} /> Customer Portal
          </Link>
          <button className="nav-link" style={{ width: '100%', color: 'oklch(0.62 0.22 25)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar" style={{ background: 'oklch(0.11 0.025 265)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', background: 'oklch(0.52 0.22 25 / 0.2)', border: '1px solid oklch(0.52 0.22 25 / 0.3)', color: 'oklch(0.68 0.22 25)', padding: '3px 10px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Admin Mode
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Elvis Yawn Bank — Management Console</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--success)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              Systems Normal
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
