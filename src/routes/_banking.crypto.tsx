import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Bitcoin, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Download } from 'lucide-react'

export const Route = createFileRoute('/_banking/crypto')({
  component: CryptoWallet,
})

const assets = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.4821, price: 62700, value: 30218.40, change24h: 2.4, change7d: 8.2, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf3B', color: 'oklch(0.74 0.17 75)' },
  { symbol: 'ETH', name: 'Ethereum', amount: 3.2100, price: 2938.50, value: 9432.59, change24h: -1.2, change7d: 3.8, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', color: 'oklch(0.60 0.20 265)' },
  { symbol: 'USDT', name: 'Tether', amount: 2500.00, price: 1.00, value: 2500.00, change24h: 0.01, change7d: 0.02, address: 'TN8RUbkTc2oSN...', color: 'oklch(0.65 0.18 145)' },
  { symbol: 'USDC', name: 'USD Coin', amount: 1000.00, price: 1.00, value: 1000.00, change24h: -0.01, change7d: 0.00, address: '0x28C6c06298d514...', color: 'oklch(0.56 0.24 265)' },
]

const cryptoTxs = [
  { type: 'buy', asset: 'BTC', amount: 0.05, value: 3135.00, date: 'Apr 22, 2026', status: 'completed', txHash: '0xabc123...' },
  { type: 'sell', asset: 'ETH', amount: 0.28, value: 823.00, date: 'Apr 12, 2026', status: 'completed', txHash: '0xdef456...' },
  { type: 'receive', asset: 'USDT', amount: 500, value: 500.00, date: 'Apr 8, 2026', status: 'completed', txHash: '0xghi789...' },
  { type: 'send', asset: 'BTC', amount: 0.02, value: 1254.00, date: 'Apr 2, 2026', status: 'completed', txHash: '0xjkl012...' },
]

type ModalType = 'buy' | 'sell' | 'send' | 'receive' | null

function CryptoWallet() {
  const [modal, setModal] = useState<ModalType>(null)
  const [selectedAsset, setSelectedAsset] = useState('BTC')
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeComplete, setTradeComplete] = useState(false)

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0)
  const asset = assets.find(a => a.symbol === selectedAsset) || assets[0]

  const handleTrade = () => {
    setTradeComplete(true)
    setTimeout(() => { setModal(null); setTradeComplete(false); setTradeAmount('') }, 2500)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Crypto Wallet</h1>
          <p className="page-subtitle">Manage your cryptocurrency portfolio</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal('receive')}><Download size={14} /> Receive</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setModal('send')}><Send size={14} /> Send</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('buy')}><Bitcoin size={14} /> Buy Crypto</button>
        </div>
      </div>

      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Portfolio overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
          <div className="stat-card" style={{ gridColumn: '1 / 3' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Total Portfolio Value</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, marginTop: 6 }}>↑ 3.2% today · +$1,283.40</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Today's P&L</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)' }}>+$1,283.40</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Unrealized gains</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>BTC Dominance</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>70.3%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>of your portfolio</div>
          </div>
        </div>

        {/* Asset list */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Your Assets</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 22 }}>Asset</th>
                <th>Price</th>
                <th>Holdings</th>
                <th>Value</th>
                <th>24h</th>
                <th>7d</th>
                <th style={{ paddingRight: 22 }}></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.symbol}>
                  <td style={{ paddingLeft: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + ' / 0.15', border: `1px solid ${a.color} / 0.25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: a.color }}>
                        {a.symbol.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{a.symbol}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{a.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${a.price.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.amount.toFixed(4)} {a.symbol}</td>
                  <td style={{ fontWeight: 700 }}>${a.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ color: a.change24h >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                    {a.change24h >= 0 ? '+' : ''}{a.change24h}%
                  </td>
                  <td style={{ color: a.change7d >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                    {a.change7d >= 0 ? '+' : ''}{a.change7d}%
                  </td>
                  <td style={{ paddingRight: 22 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-success btn-sm" onClick={() => { setSelectedAsset(a.symbol); setModal('buy') }}>Buy</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { setSelectedAsset(a.symbol); setModal('sell') }}>Sell</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crypto transactions */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Recent Crypto Activity</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Date</th>
                <th>Tx Hash</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cryptoTxs.map((tx, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {tx.type === 'buy' || tx.type === 'receive' ? <ArrowDownLeft size={14} style={{ color: 'var(--success)' }} /> : <ArrowUpRight size={14} style={{ color: 'var(--danger)' }} />}
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{tx.type}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{tx.asset}</td>
                  <td>{tx.amount} {tx.asset}</td>
                  <td style={{ fontWeight: 600 }}>${tx.value.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.txHash}</td>
                  <td><span className="badge badge-success">{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'black / 0.7', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: 420, padding: 28, margin: 16 }}>
            {tradeComplete ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>✓</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
                  {modal === 'buy' ? 'Purchase' : modal === 'sell' ? 'Sale' : modal === 'send' ? 'Sent' : 'Address Ready'}
                  {' '}Complete!
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 6 }}>Transaction confirmed on blockchain</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{modal} Crypto</h3>
                  <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Asset</label>
                    <select className="input" value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
                      {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>)}
                    </select>
                  </div>
                  {(modal === 'send') && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Recipient Address</label>
                      <input className="input" placeholder="Wallet address or ENS..." />
                    </div>
                  )}
                  {modal === 'receive' ? (
                    <div style={{ background: 'oklch(0.13 0.02 265)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Your {selectedAsset} Address</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all', color: 'var(--text-primary)', padding: '8px 10px', background: 'oklch(0.16 0.025 265)', borderRadius: 8 }}>
                        {asset.address}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 8 }}>Only send {selectedAsset} to this address</div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                        {modal === 'buy' || modal === 'sell' ? 'Amount (USD)' : `Amount (${selectedAsset})`}
                      </label>
                      <input className="input" type="number" placeholder="0.00" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} />
                      {tradeAmount && modal === 'buy' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 5 }}>
                          ≈ {(parseFloat(tradeAmount) / asset.price).toFixed(8)} {selectedAsset}
                        </div>
                      )}
                    </div>
                  )}
                  {modal !== 'receive' && (
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      <button className="btn btn-secondary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
                      <button className={`btn ${modal === 'sell' || modal === 'send' ? 'btn-danger' : 'btn-primary'} btn-lg`} style={{ flex: 1, justifyContent: 'center' }} onClick={handleTrade}>
                        Confirm {modal}
                      </button>
                    </div>
                  )}
                  {modal === 'receive' && (
                    <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setModal(null)}>Close</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
