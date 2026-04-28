import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Send, ArrowLeftRight, Globe, Clock, QrCode, Users, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/_banking/transfers')({
  component: Transfers,
})

type TransferType = 'internal' | 'ach' | 'wire' | 'international' | 'zelle'

const transferTypes = [
  { id: 'internal' as TransferType, label: 'Internal Transfer', icon: ArrowLeftRight, desc: 'Between your accounts', time: 'Instant', fee: 'Free' },
  { id: 'ach' as TransferType, label: 'ACH Transfer', icon: Users, desc: 'US bank accounts', time: '1-3 days', fee: 'Free' },
  { id: 'wire' as TransferType, label: 'Wire Transfer', icon: Send, desc: 'Fast US wires', time: 'Same day', fee: '$15' },
  { id: 'international' as TransferType, label: 'International', icon: Globe, desc: 'Global payments', time: '2-5 days', fee: '$25' },
  { id: 'zelle' as TransferType, label: 'Zelle / Instant', icon: Clock, desc: 'Phone or email', time: 'Instant', fee: 'Free' },
]

const recentRecipients = [
  { name: 'Jane Smith', account: '•••• 5821', bank: 'Chase', initials: 'JS' },
  { name: 'Mike Johnson', account: '•••• 9944', bank: 'BOA', initials: 'MJ' },
  { name: 'Sarah Williams', account: '•••• 3310', bank: 'Wells Fargo', initials: 'SW' },
  { name: 'David Brown', account: '•••• 7721', bank: 'Citibank', initials: 'DB' },
]

function generateVerificationCodes() {
  const ts = Date.now().toString(36).toUpperCase()
  return {
    ref: `EYB-${ts}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    coc: `COC-${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
    vat: `VAT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    auth: `AUTH-${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
    otp: Math.floor(100000 + Math.random() * 900000).toString(),
  }
}

function Transfers() {
  const [activeType, setActiveType] = useState<TransferType>('internal')
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [fromAccount, setFromAccount] = useState('Checking — ••••4821')
  const [note, setNote] = useState('')
  const [codes, setCodes] = useState<ReturnType<typeof generateVerificationCodes> | null>(null)

  const handleReview = () => {
    if (!amount || !recipient) return
    setStep('review')
  }

  const handleSend = () => {
    setCodes(generateVerificationCodes())
    setStep('success')
  }

  const reset = () => {
    setStep('form')
    setAmount('')
    setRecipient('')
    setNote('')
    setCodes(null)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Money Transfers</h1>
          <p className="page-subtitle">Send money locally or globally</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Transfer types */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Transfer Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {transferTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  style={{
                    background: activeType === t.id ? 'oklch(0.56 0.24 265 / 0.18)' : 'oklch(0.16 0.02 265 / 0.8)',
                    border: `1px solid ${activeType === t.id ? 'oklch(0.56 0.24 265 / 0.4)' : 'var(--surface-border)'}`,
                    borderRadius: 10, padding: '10px 8px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <t.icon size={16} style={{ color: activeType === t.id ? 'oklch(0.74 0.18 265)' : 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: activeType === t.id ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {step === 'form' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '0.95rem', fontWeight: 700 }}>
                {transferTypes.find(t => t.id === activeType)?.label}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>From Account</label>
                  <select className="input" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                    <option>Checking — ••••4821 ($24,850.00)</option>
                    <option>Savings — ••••7293 ($48,200.00)</option>
                    <option>Business — ••••3310 ($12,400.00)</option>
                  </select>
                </div>
                {activeType === 'internal' ? (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>To Account</label>
                    <select className="input">
                      <option>Savings — ••••7293 ($48,200.00)</option>
                      <option>Checking — ••••4821 ($24,850.00)</option>
                      <option>Business — ••••3310 ($12,400.00)</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                        {activeType === 'zelle' ? 'Phone or Email' : 'Recipient Name or Account'}
                      </label>
                      <input className="input" placeholder={activeType === 'zelle' ? 'phone@example.com' : 'Full name or account number'} value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                    </div>
                    {(activeType === 'ach' || activeType === 'wire') && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Routing Number</label>
                          <input className="input" placeholder="9-digit ABA number" />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Account Number</label>
                          <input className="input" placeholder="Account number" />
                        </div>
                      </div>
                    )}
                    {activeType === 'international' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>SWIFT / BIC</label>
                          <input className="input" placeholder="XXXXXXXXXX" />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>IBAN</label>
                          <input className="input" placeholder="GBXXXXXXXXXXXX" />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Amount (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>$</span>
                    <input className="input" style={{ paddingLeft: 26 }} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Note (optional)</label>
                  <input className="input" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <div style={{ background: 'oklch(0.56 0.24 265 / 0.08)', border: '1px solid oklch(0.56 0.24 265 / 0.2)', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>Transfer time</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{transferTypes.find(t => t.id === activeType)?.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Fee</div>
                    <div style={{ fontWeight: 600, marginTop: 2, color: 'var(--success)' }}>{transferTypes.find(t => t.id === activeType)?.fee}</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} onClick={handleReview}>
                  <Send size={16} /> Review Transfer
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '0.95rem', fontWeight: 700 }}>Review Transfer</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Type', transferTypes.find(t => t.id === activeType)?.label],
                  ['From', fromAccount],
                  ['To', recipient || 'Internal Account'],
                  ['Amount', `$${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
                  ['Fee', transferTypes.find(t => t.id === activeType)?.fee],
                  ['Note', note || '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'oklch(0.74 0.17 85 / 0.1)', border: '1px solid oklch(0.74 0.17 85 / 0.25)', borderRadius: 10, padding: 14, marginTop: 16, fontSize: '0.82rem', color: 'oklch(0.80 0.17 85)' }}>
                ⚠️ A transaction authorization code and receipt will be sent to your email after completion.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                <button className="btn btn-secondary btn-lg" style={{ justifyContent: 'center' }} onClick={() => setStep('form')}>Back</button>
                <button className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} onClick={handleSend}>
                  Confirm & Send
                </button>
              </div>
            </div>
          )}

          {step === 'success' && codes && (
            <div className="glass-card" style={{ padding: 24, border: '1px solid oklch(0.58 0.18 145 / 0.4)' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'oklch(0.58 0.18 145 / 0.2)', border: '2px solid oklch(0.58 0.18 145 / 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.5rem' }}>✓</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>Transfer Successful!</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>A receipt has been sent to your email.</div>
              </div>
              <div style={{ background: 'oklch(0.13 0.02 265)', borderRadius: 12, padding: 16, fontFamily: 'monospace', fontSize: '0.78rem', border: '1px solid var(--surface-border)' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 10 }}>═══ ELVIS YAWN BANK — TRANSACTION RECEIPT ═══</div>
                {[
                  ['Reference ID', codes.ref],
                  ['COC Code', codes.coc],
                  ['VAT Code', codes.vat],
                  ['Auth Number', codes.auth],
                  ['OTP Verified', codes.otp],
                  ['Amount', `$${parseFloat(amount || '0').toFixed(2)}`],
                  ['Status', 'COMPLETED'],
                  ['Compliance', 'CLEARED'],
                  ['Timestamp', new Date().toISOString()],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{k}:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ color: 'var(--gold)', fontWeight: 700, marginTop: 10 }}>═══════════════════════════════════════════</div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }} onClick={reset}>
                New Transfer
              </button>
            </div>
          )}
        </div>

        {/* Right: Recent recipients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Recent Recipients</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentRecipients.map((r) => (
                <div key={r.name} className="glass-card-2" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                  onClick={() => { setRecipient(r.name); setStep('form') }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, oklch(0.56 0.24 265), oklch(0.52 0.24 285))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>
                    {r.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{r.bank} · {r.account}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>QR Payment</h3>
            <div style={{ textAlign: 'center', padding: 20, background: 'oklch(0.16 0.025 265)', borderRadius: 12, border: '1px solid var(--surface-border)' }}>
              <QrCode size={64} style={{ color: 'var(--brand-light)', margin: '0 auto 10px' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Scan to pay John Doe</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>EYB·JD·4821</div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700 }}>Transfer Limits</h3>
            {[
              { type: 'Internal', daily: '$100,000', monthly: 'Unlimited' },
              { type: 'ACH', daily: '$25,000', monthly: '$100,000' },
              { type: 'Wire', daily: '$50,000', monthly: '$200,000' },
              { type: 'International', daily: '$10,000', monthly: '$50,000' },
            ].map((l) => (
              <div key={l.type} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l.type}</span>
                <span style={{ fontWeight: 500 }}>{l.daily}/day</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
