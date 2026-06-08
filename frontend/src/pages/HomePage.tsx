import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../features/blockchain/WalletContext';
import type { Transaction, Balance } from '../hooks/useBlockchain';
import { Button } from '../components/ui/Button';
import { format, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  LayoutDashboard, ClipboardList, TrendingUp, Shield, Settings,
  LogOut, Bell, Plus, ArrowUp, ArrowDown, Building2, UserCircle2,
  CalendarDays, CheckCircle2, Clock, AlertCircle, RefreshCw
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

const idr = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const shortMonth = (d: Date) =>
  format(d, 'MMM', { locale: idLocale });

// ─── stat card ────────────────────────────────────────────────────────────────

type StatVariant = 'gold' | 'green' | 'red';

function StatCard({
  label, value, pct, icon, variant, barPct,
}: {
  label: string; value: string; pct: string; icon: React.ReactNode;
  variant: StatVariant; barPct: number;
}) {
  const colors: Record<StatVariant, { bar: string; pct: string }> = {
    gold:  { bar: 'bg-[var(--color-brand-orange)]', pct: 'text-[var(--color-brand-orange)]' },
    green: { bar: 'bg-[var(--color-income)]',        pct: 'text-[var(--color-income)]'       },
    red:   { bar: 'bg-[var(--color-expense)]',       pct: 'text-[var(--color-expense)]'      },
  };
  const c = colors[variant];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Row: icon + percentage */}
      <div className="flex items-center justify-between">
        {/* Bare icon – uniform muted gray, no box */}
        <span
          className="flex items-center justify-center"
          style={{ color: 'var(--color-text-muted)' }}
          aria-hidden="true"
        >
          {icon}
        </span>
        {/* Pct badge */}
        <span
          className={`text-xs tabular-nums rounded-full px-2 py-0.5 ${c.pct}`}
          style={{ fontWeight: 'var(--fw-medium)', background: 'rgba(255,255,255,0.05)' }}
        >
          {pct}
        </span>
      </div>

      <div>
        {/* WCAG AA: text-sm (14px) + secondary color (5.1:1 contrast) */}
        <p
          className="text-sm text-[var(--color-text-secondary)] mb-1.5 uppercase"
          style={{ fontWeight: 'var(--fw-light)', letterSpacing: '0.07em' }}
        >
          {label}
        </p>
        {/* KPI value – text-3xl (30px) extrabold, highly readable */}
        <p
          className="text-3xl tracking-tight text-[var(--color-text-primary)] tabular-nums leading-none"
          style={{ fontWeight: 'var(--fw-extrabold)' }}
        >
          {value}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-px w-full rounded-full bg-[var(--color-border-strong)]" aria-hidden="true">
        <div
          className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
          style={{ width: `${Math.min(barPct, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── tooltip for chart ────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-3 text-xs shadow-xl">
      <p className="text-[var(--color-text-secondary)] mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {idr(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── donut chart ─────────────────────────────────────────────────────────────

const COLORS: Record<string, string> = {
  'Keagamaan':   '#f97316', // Orange
  'Sosial':      '#a78bfa', // Purple
  'Operasional': '#60a5fa', // Blue
  'Infrastruktur': '#34d399', // Green
  'Dana Darurat': '#fbbf24', // Yellow
  'Lainnya':     '#9ca3af', // Gray
  'Dana Punia':    '#f97316', // Orange
  'Iuran Anggota': '#34d399', // Green
  'Donasi':        '#60a5fa', // Blue
};

function AllocDonut({ transactions, isIncome = false, onFlip }: { transactions: any[], isIncome?: boolean, onFlip: () => void }) {
  // Calculate total
  const total = transactions.reduce((sum, tx) => sum + tx.nominal, 0);

  // Sub-categories: map Konsumsi → Operasional
  const getMainCategory = (cat: string) => {
    if (isIncome) return cat; // Pemasukan tidak digabung
    const map: Record<string, string> = {
      'Konsumsi': 'Operasional',
    };
    return map[cat] || cat;
  };
  
  // Group by MAIN category
  const grouped = transactions.reduce((acc, tx) => {
    const mainCat = getMainCategory(tx.category) || 'Lainnya';
    acc[mainCat] = (acc[mainCat] || 0) + tx.nominal;
    return acc;
  }, {} as Record<string, number>);

  // Format for Recharts — use fixed color map by name
  let data = Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value: value as number,
      pct: total > 0 ? Math.round(((value as number) / total) * 100) : 0,
      color: COLORS[name] || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value); // Sort by highest

  // If no data, show empty gray circle
  if (data.length === 0) {
    data = [{ name: isIncome ? 'Belum ada pemasukan' : 'Belum ada pengeluaran', value: 1, pct: 0, color: '#374151' }];
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border p-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-lg text-[var(--color-text-primary)]" style={{ fontWeight: 'var(--fw-bold)' }}>
          {isIncome ? 'Pemasukan' : 'Pengeluaran'}
        </h2>
        <button 
          onClick={onFlip} 
          className="flex items-center justify-center w-8 h-8 rounded-lg border transition-colors hover:bg-[var(--color-bg-card-hover)]"
          style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-strong)' }}
          title="Putar grafik"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1">
      <div className="relative flex items-center justify-center shrink-0" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center pointer-events-none">
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest" style={{ fontWeight: 'var(--fw-medium)' }}>TOTAL</p>
          <p className="text-2xl text-[var(--color-text-primary)] tabular-nums" style={{ fontWeight: 'var(--fw-extrabold)' }}>
            {total > 0 ? '100%' : '0%'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {total === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-muted)] italic">Belum ada {isIncome ? 'pemasukan' : 'pengeluaran'}</p>
        ) : (
          data.map(a => (
            <div key={a.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} aria-hidden="true" />
                <span className="text-[var(--color-text-secondary)]">{a.name}</span>
              </div>
              <span className="tabular-nums" style={{ color: a.color, fontWeight: 'var(--fw-semibold)' }}>{a.pct}%</span>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

// ─── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'Verified' | 'Pending' | 'Rejected' }) {
  const map = {
    Verified: { icon: <CheckCircle2 className="w-3 h-3" />, cls: 'text-[var(--color-income)]' },
    Pending:  { icon: <Clock className="w-3 h-3" />,        cls: 'text-[var(--color-pending)]' },
    Rejected: { icon: <AlertCircle className="w-3 h-3" />,  cls: 'text-[var(--color-expense)]' },
  };
  const { icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${cls}`}>
      {icon}{status}
    </span>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const {
    isConnected, connectWallet,
    getTransactions, getBalance,
    addTransaction, isOwner,
  } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ income: 0, expense: 0, balance: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [isChartFlipped, setIsChartFlipped] = useState(false);

  // form state
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState('');
  const [isIncome, setIsIncome] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [txs, bal] = await Promise.all([getTransactions(), getBalance()]);
      setTransactions(txs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setBalance(bal);
    } catch (e) { console.error(e); }
  }, [getTransactions, getBalance]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [fetchData]);

  // build 6-month area chart data from transactions
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const monthLabel = shortMonth(d);
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthTxs = transactions.filter(t => {
      const td = new Date(t.timestamp);
      return td.getMonth() === month && td.getFullYear() === year;
    });
    return {
      name: monthLabel,
      Pemasukan: monthTxs.filter(t => t.isIncome).reduce((s, t) => s + t.nominal, 0),
      Pengeluaran: monthTxs.filter(t => !t.isIncome).reduce((s, t) => s + t.nominal, 0),
    };
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const n = Number(nominal);
    if (!keterangan.trim()) { setFormError('Keterangan tidak boleh kosong.'); return; }
    if (!n || n <= 0) { setFormError('Nominal harus lebih dari 0.'); return; }
    setIsSubmitting(true);
    try {
      await addTransaction(keterangan, n, isIncome);
      setKeterangan(''); setNominal('');
      setShowAddModal(false);
      await fetchData();
    } catch (err: any) {
      setFormError(err.reason || err.message || 'Transaksi gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // extract category, pure description, and ipfs link
  const parseDescription = (raw: string) => {
    const matchCat = raw.match(/^\[(.*?)\]\s*/);
    let category = matchCat ? matchCat[1] : '';
    let desc = raw;
    
    if (matchCat) {
      desc = raw.substring(matchCat[0].length);
    } else {
      // Fallback for old unformatted transactions
      const lower = raw.toLowerCase();
      if (lower.includes('server') || lower.includes('cloud') || lower.includes('it')) category = 'IT Infrastructure';
      else if (lower.includes('rapat') || lower.includes('konsumsi')) category = 'Operasional';
      else if (lower.includes('punia') || lower.includes('donasi') || lower.includes('dana')) category = 'Pemasukan';
      else if (lower.includes('banten') || lower.includes('upacara')) category = 'Keagamaan';
      else category = 'Operasional';
    }

    const matchIpfs = desc.match(/\|\s*(ipfs:\/\/[^\s]+)$/);
    let ipfsUrl = null;
    if (matchIpfs) {
      ipfsUrl = matchIpfs[1];
      desc = desc.substring(0, matchIpfs.index).trim();
    }

    return { category, desc, ipfsUrl };
  };

  return (
    <>
      {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl tracking-tight text-[var(--color-text-primary)]" style={{ fontWeight: 'var(--fw-bold)' }}>
                Data Overview
              </h1>
              {/* WCAG: text-sm (14px) + secondary color 5.1:1 contrast */}
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--fw-light)' }}>
                Status transparansi keuangan komunitas &middot; diperbarui otomatis setiap 15 detik
              </p>
            </div>
            <button
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-colors cursor-pointer font-medium"
              style={{
                background: 'var(--color-bg-card)',
                borderColor: 'var(--color-border-strong)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <CalendarDays size={14} aria-hidden="true" />
              Bulan Ini
            </button>
          </div>

          {/* ── Stat cards row ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Saldo Terkini"
              value={idr(balance.balance)}
              pct="+1.2%"
              icon={<Building2 size={14} strokeWidth={2.5} />}
              variant="gold"
              barPct={balance.income > 0 ? (balance.balance / balance.income) * 100 : 0}
            />
            <StatCard
              label="Total Pemasukan"
              value={idr(balance.income)}
              pct="+8.4%"
              icon={<ArrowDown size={14} strokeWidth={2.5} />}
              variant="green"
              barPct={balance.income > 0 ? 100 : 0}
            />
            <StatCard
              label="Total Pengeluaran"
              value={idr(balance.expense)}
              pct="-2.1%"
              icon={<ArrowUp size={14} strokeWidth={2.5} />}
              variant="red"
              barPct={balance.income > 0 ? (balance.expense / balance.income) * 100 : 0}
            />
          </div>

          {/* ── Chart row ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

            {/* Area Chart – Arus Kas Dana */}
            <div
              className="lg:col-span-2 rounded-2xl border p-5 flex flex-col h-full"
              style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-lg text-[var(--color-text-primary)]" style={{ fontWeight: 'var(--fw-bold)' }}>Arus Kas Dana</h2>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-brand-orange)' }} aria-hidden="true" />
                    Pemasukan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-text-muted)' }} aria-hidden="true" />
                    Pengeluaran
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-[192px]" aria-label="Grafik arus kas dana 6 bulan terakhir">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6b6573" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6b6573" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                      tickLine={false} axisLine={false}
                    />
                    <YAxis
                      tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(0) + 'jt' : String(v)}
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                      tickLine={false} axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone" dataKey="Pemasukan"
                      stroke="#f97316" strokeWidth={2}
                      fill="url(#gradIn)"
                    />
                    <Area
                      type="monotone" dataKey="Pengeluaran"
                      stroke="#6b6573" strokeWidth={2}
                      fill="url(#gradOut)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut – Alokasi Dana (Flippable Card) */}
            <div style={{ perspective: '1000px' }} className="relative h-full">
              <div
                className="w-full h-full transition-transform duration-700 grid"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isChartFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* FRONT (Pengeluaran) */}
                <div 
                  className="w-full h-full"
                  style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1' }}
                >
                  <AllocDonut 
                    transactions={transactions.filter(t => !t.isIncome).map(t => ({ ...t, ...parseDescription(t.keterangan) }))} 
                    isIncome={false}
                    onFlip={() => setIsChartFlipped(true)}
                  />
                </div>

                {/* BACK (Pemasukan) */}
                <div 
                  className="w-full h-full"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', gridArea: '1 / 1' }}
                >
                  <AllocDonut 
                    transactions={transactions.filter(t => t.isIncome).map(t => ({ ...t, ...parseDescription(t.keterangan) }))} 
                    isIncome={true}
                    onFlip={() => setIsChartFlipped(false)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Transaction table ─────────────────────────────────────── */}
          <div
            className="rounded-2xl border"
            style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg text-[var(--color-text-primary)]" style={{ fontWeight: 'var(--fw-bold)' }}>Transaksi Terbaru</h2>
              <Link
                to="/transaksi"
                className="text-xs transition-colors hover:underline cursor-pointer"
                style={{ color: 'var(--color-brand-orange)', fontWeight: 'var(--fw-semibold)' }}
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Tabel transaksi terbaru">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['DESKRIPSI', 'KATEGORI', 'TANGGAL', 'STATUS', 'JUMLAH'].map(h => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs uppercase"
                        style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        Belum ada transaksi yang tercatat di blockchain.
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 8).map(tx => {
                      const { category, desc, ipfsUrl } = parseDescription(tx.keterangan);
                      return (
                        <tr
                          key={tx.id}
                          className="transition-colors"
                          style={{ borderBottom: '1px solid var(--color-border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {/* Deskripsi */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  background: tx.isIncome ? 'var(--color-income-dim)' : 'var(--color-expense-dim)',
                                  color: tx.isIncome ? 'var(--color-income)' : 'var(--color-expense)',
                                }}
                                aria-hidden="true"
                              >
                                {tx.isIncome ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className="text-[var(--color-text-primary)] font-medium"
                                  title={desc}
                                >
                                  {desc}
                                </span>
                                {ipfsUrl && (
                                  <a href={ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} target="_blank" rel="noreferrer" className="text-[10px] font-semibold mt-0.5 text-[var(--color-brand-orange)] hover:underline">
                                    Lihat Bukti
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Kategori */}
                          <td className="px-5 py-3.5">
                            <span
                              className="px-2.5 py-0.5 rounded-lg text-xs font-medium"
                              style={{
                                background: 'var(--color-bg-card-hover)',
                                color: 'var(--color-text-secondary)',
                                border: '1px solid var(--color-border-strong)',
                              }}
                            >
                              {category}
                            </span>
                          </td>

                          {/* Tanggal */}
                          <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
                            {format(tx.timestamp, 'dd MMM yyyy', { locale: idLocale })}
                          </td>

                          {/* Status – on-chain = Verified */}
                          <td className="px-5 py-3.5">
                            <StatusBadge status="Verified" />
                          </td>

                          {/* Jumlah */}
                          <td
                            className="px-5 py-3.5 text-right tabular-nums text-sm"
                            style={{ color: tx.isIncome ? 'var(--color-income)' : 'var(--color-expense)', fontWeight: 'var(--fw-semibold)' }}
                          >
                            {tx.isIncome ? '+' : '-'}{idr(tx.nominal)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        {/* Content wrapper removed to use global Layout */}

      {/* ── FAB – Tambah Transaksi (Bendahara only) ─────────────────── */}
      {isOwner && (
        <>

          {/* Add Transaction Modal */}
          {showAddModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.65)' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
            >
              <div
                className="w-full max-w-md rounded-2xl border p-6 shadow-2xl"
                style={{
                  background: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border-strong)',
                }}
              >
                {/* Modal header */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
                >
                  <h2 id="modal-title" className="text-base text-[var(--color-text-primary)]" style={{ fontWeight: 'var(--fw-bold)' }}>
                    Catat Transaksi Baru
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Data akan dicatat permanen di blockchain · MetaMask diperlukan
                  </p>
                </div>

                <form onSubmit={handleAdd} className="space-y-4" noValidate>
                  {/* Type toggle */}
                  <fieldset>
                    <legend className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em' }}>
                      Jenis Transaksi
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Pemasukan', value: true,  color: 'var(--color-income)',   dim: 'var(--color-income-dim)'  },
                        { label: 'Pengeluaran', value: false, color: 'var(--color-expense)', dim: 'var(--color-expense-dim)' },
                      ].map(opt => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setIsIncome(opt.value)}
                          className="py-2.5 rounded-xl text-sm transition-all cursor-pointer border"
                          style={{
                            background: isIncome === opt.value ? opt.dim : 'var(--color-bg-card-hover)',
                            color:      isIncome === opt.value ? opt.color : 'var(--color-text-secondary)',
                            borderColor: isIncome === opt.value ? opt.color : 'var(--color-border)',
                            fontWeight: 'var(--fw-semibold)',
                          }}
                          aria-pressed={isIncome === opt.value}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Nominal */}
                  <div>
                    <label
                      htmlFor="modal-nominal"
                      className="block text-xs uppercase mb-1.5"
                      style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em' }}
                    >
                      Nominal (IDR)
                    </label>
                    <div
                      className="flex items-center rounded-xl border px-4 py-3 gap-2 transition-colors"
                      style={{
                        background: 'var(--color-bg-input)',
                        borderColor: 'var(--color-border-strong)',
                      }}
                    >
                      <span className="text-sm shrink-0" style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>Rp</span>
                      <input
                        id="modal-nominal"
                        type="number"
                        min="1"
                        value={nominal}
                        onChange={e => setNominal(e.target.value)}
                        placeholder="500000"
                        className="flex-1 bg-transparent text-sm outline-none"
                        style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--fw-semibold)' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label
                      htmlFor="modal-keterangan"
                      className="block text-xs uppercase mb-1.5"
                      style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)', letterSpacing: '0.08em' }}
                    >
                      Keterangan
                    </label>
                    <textarea
                      id="modal-keterangan"
                      rows={2}
                      value={keterangan}
                      onChange={e => setKeterangan(e.target.value)}
                      placeholder="Contoh: Dana Punia dari Banjar Kaja"
                      className="w-full rounded-xl border px-4 py-3 text-sm resize-none outline-none transition-colors"
                      style={{
                        background: 'var(--color-bg-input)',
                        borderColor: 'var(--color-border-strong)',
                        color: 'var(--color-text-primary)',
                      }}
                      required
                    />
                  </div>

                  {/* Error */}
                  {formError && (
                    <p className="text-xs font-medium rounded-lg px-3 py-2" style={{ background: 'var(--color-expense-dim)', color: 'var(--color-expense)' }}>
                      {formError}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => { setShowAddModal(false); setFormError(''); }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1 rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Mengirim…' : 'Simpan ke Blockchain'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
