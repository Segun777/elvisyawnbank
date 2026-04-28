import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Upload, Camera, CheckCircle, XCircle, Clock, AlertTriangle, Eye } from 'lucide-react'

export const Route = createFileRoute('/_banking/deposit')({
  component: CheckDeposit,
})

const previousDeposits = [
  { id: 'CHK-001', amount: 1200.00, date: 'Apr 17, 2026', status: 'pending', bank: 'Chase', memo: 'April rent refund', hold: 'Apr 19, 2026' },
  { id: 'CHK-002', amount: 3500.00, date: 'Apr 10, 2026', status: 'approved', bank: 'Wells Fargo', memo: 'Freelance payment', hold: 'Released' },
  { id: 'CHK-003', amount: 250.00, date: 'Apr 5, 2026', status: 'approved', bank: 'Citibank', memo: 'Insurance reimbursement', hold: 'Released' },
  { id: 'CHK-004', amount: 8000.00, date: 'Mar 28, 2026', status: 'review', bank: 'Unknown', memo: 'Business payment', hold: 'Under review' },
  { id: 'CHK-005', amount: 500.00, date: 'Mar 20, 2026', status: 'rejected', bank: 'BOA', memo: 'Personal', hold: '—' },
]

function CheckDeposit() {
  const [step, setStep] = useState<'upload' | 'review' | 'submitted'>('upload')
  const [frontUploaded, setFrontUploaded] = useState(false)
  const [backUploaded, setBackUploaded] = useState(false)
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('Checking — ••••4821')
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const handleFrontUpload = () => {
    setFrontUploaded(true)
    setScanning(true)
    setTimeout(() => { setScanning(false); setScanned(true) }, 2000)
  }

  const handleSubmit = () => setStep('submitted')

  const statusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle size={14} style={{ color: 'var(--success)' }} />
    if (status === 'rejected') return <XCircle size={14} style={{ color: 'var(--danger)' }} />
    if (status === 'pending') return <Clock size={14} style={{ color: 'var(--warning)' }} />
    return <AlertTriangle size={14} style={{ color: 'oklch(0.74 0.18 290)' }} />
  }

  const statusClass = (status: string) => {
    if (status === 'approved') return 'badge-success'
    if (status === 'rejected') return 'badge-danger'
    if (status === 'pending') return 'badge-pending'
    return 'badge-review'
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mobile Check Deposit</h1>
          <p className="page-subtitle">Deposit checks from anywhere using your camera</p>
        </div>
      </div>

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Deposit form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 'upload' && (
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700 }}>New Check Deposit</h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Take or upload a clear photo of the front and back of your check. Our AI system verifies check authenticity automatically.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Deposit to Account</label>
                  <select className="input" value={account} onChange={(e) => setAccount(e.target.value)}>
                    <option>Checking — ••••4821 ($24,850.00)</option>
                    <option>Savings — ••••7293 ($48,200.00)</option>
                    <option>Business — ••••3310 ($12,400.00)</option>
                  </select>
                </div>

                {/* Front of check */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Front of Check</label>
                  <div
                    onClick={handleFrontUpload}
                    style={{
                      border: `2px dashed ${frontUploaded ? 'oklch(0.58 0.18 145 / 0.5)' : 'var(--surface-border)'}`,
                      borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                      background: frontUploaded ? 'oklch(0.58 0.18 145 / 0.06)' : 'oklch(0.13 0.02 265 / 0.5)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {scanning ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div className="spinner" />
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>AI scanning check… detecting routing, amount, signature…</div>
                      </div>
                    ) : frontUploaded ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Front uploaded & verified</div>
                        {scanned && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Routing: 021000021 · Amount detected · Signature: OK</div>}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <Camera size={32} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Take or upload photo</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Front side of the check</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <span className="badge badge-info">Camera</span>
                          <span className="badge badge-info">Photo Upload</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back of check */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Back of Check (Endorsement)</label>
                  <div
                    onClick={() => setBackUploaded(true)}
                    style={{
                      border: `2px dashed ${backUploaded ? 'oklch(0.58 0.18 145 / 0.5)' : 'var(--surface-border)'}`,
                      borderRadius: 12, padding: '20px', textAlign: 'center', cursor: 'pointer',
                      background: backUploaded ? 'oklch(0.58 0.18 145 / 0.06)' : 'oklch(0.13 0.02 265 / 0.5)',
                    }}
                  >
                    {backUploaded ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                        <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>Back uploaded</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Upload size={18} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Upload back with endorsement</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Check Amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>$</span>
                    <input className="input" style={{ paddingLeft: 26 }} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
                  </div>
                  {scanned && !amount && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: 4 }}>💡 AI detected: $1,200.00 — click to use</div>
                  )}
                </div>

                {/* AI verification result */}
                {scanned && (
                  <div style={{ background: 'oklch(0.58 0.18 145 / 0.08)', border: '1px solid oklch(0.58 0.18 145 / 0.25)', borderRadius: 10, padding: 14, fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>✓ AI Fraud Check: Passed</div>
                    {[
                      ['Check Authenticity', '98.4% confidence'],
                      ['MICR Line', 'Valid'],
                      ['Signature', 'Detected'],
                      ['Duplicate Check', 'No duplicate found'],
                      ['Amount Detected', '$1,200.00'],
                      ['Bank', 'JPMorgan Chase'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg"
                  style={{ justifyContent: 'center' }}
                  onClick={handleSubmit}
                  disabled={!frontUploaded}
                >
                  <Upload size={16} /> Submit for Deposit
                </button>
              </div>
            </div>
          )}

          {step === 'submitted' && (
            <div className="glass-card" style={{ padding: 24, border: '1px solid oklch(0.56 0.24 265 / 0.4)' }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'oklch(0.56 0.24 265 / 0.2)', border: '2px solid oklch(0.56 0.24 265 / 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>📬</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>Check Submitted!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Your deposit is under review. You'll receive an email confirmation with verification codes.</div>
                <div style={{ background: 'oklch(0.13 0.02 265)', borderRadius: 10, padding: 14, fontFamily: 'monospace', fontSize: '0.78rem', border: '1px solid var(--surface-border)', textAlign: 'left', marginBottom: 16 }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>═══ DEPOSIT RECEIPT ═══</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Deposit ID: </span>CHK-{Date.now().toString(36).toUpperCase()}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Amount: </span>${amount || '1,200.00'}</div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Status: </span><span style={{ color: 'var(--warning)' }}>PENDING REVIEW</span></div>
                    <div><span style={{ color: 'var(--text-secondary)' }}>Estimated: </span>1-2 business days</div>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => { setStep('upload'); setFrontUploaded(false); setBackUploaded(false); setScanned(false); setAmount('') }}>
                  Deposit Another Check
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Deposit limits */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Deposit Limits</h3>
            {[
              { label: 'Per check', value: '$10,000' },
              { label: 'Daily limit', value: '$25,000' },
              { label: 'Monthly limit', value: '$100,000' },
              { label: 'Standard hold', value: '1-2 business days' },
              { label: 'Large check hold', value: '5 business days' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid oklch(0.18 0.02 265 / 0.4)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l.label}</span>
                <span style={{ fontWeight: 600 }}>{l.value}</span>
              </div>
            ))}
          </div>

          {/* Previous deposits */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700 }}>Deposit History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {previousDeposits.map((d) => (
                <div key={d.id} className="glass-card-2" style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>${d.amount.toLocaleString()}</span>
                    <span className={`badge ${statusClass(d.status)}`}>
                      {d.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{d.bank} · {d.memo}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{d.date} · Hold: {d.hold}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
