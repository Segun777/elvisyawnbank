import { createFileRoute, Outlet, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, Bitcoin,
  Camera, FileText, Bell, Settings, LogOut, Menu, X,
  Wallet, Receipt, Shield, ChevronRight, TrendingUp,
  Home, User,
} from 'lucide-react'

export const Route = createFileRoute('/_banking')({
  component: BankingLayout,
})

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/transactions', icon: Receipt, label: 'Transactions' },
  { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { to: '/deposit', icon: Camera, label: 'Check Deposit' },
  { to: '/crypto', icon: Bitcoin, label: 'Crypto' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/bills', icon: FileText, label: 'Bill Pay' },
]

function BankingLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="banking-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} style={{ width: 240 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px oklch(0.56 0.24 265 / 0.4)',
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                Elvis Yawn
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Bank
              </div>
            </div>
          </div>
        </div>

        {/* Account summary */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: 'white',
            }}>
              JD
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>John Doe</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Premium Account</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 10px', flex: 1 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 4px 8px' }}>
            Banking
          </div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
              style={{ marginBottom: 2 }}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 4px 8px', marginTop: 8 }}>
            Admin
          </div>
          <Link to="/admin" className="nav-link" style={{ marginBottom: 2 }} onClick={() => setSidebarOpen(false)}>
            <Shield size={16} />
            Admin Portal
          </Link>
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--surface-border)' }}>
          <button className="nav-link" style={{ width: '100%' }}>
            <Settings size={16} /> Settings
          </button>
          <button className="nav-link" style={{ width: '100%', color: 'oklch(0.62 0.22 25)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 8px', display: 'flex', alignItems: 'center' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={16} />
            </button>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>John Doe</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }}>
                <Bell size={16} />
              </button>
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: 'oklch(0.62 0.22 25)',
                border: '2px solid var(--surface-card)',
              }} />
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'white', cursor: 'pointer',
            }}>
              JD
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  )
}
