import { useEffect, useState, useCallback } from 'react';
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
  CalendarDays, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

const idr = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const shortMonth = (d: Date) =>
  format(d, 'MMM', { locale: idLocale });

// ─── sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({
  icon, label, active = false, badge,
}: {
  icon: React.ReactNode; label: string; active?: boolean; badge?: number;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={[
        'relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 cursor-pointer',
        active
          ? 'bg-[var(--color-brand-orange-dim)] text-[var(--color-brand-orange)]'
          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-secondary)]',
      ].join(' ')}
    >
      {icon}
      {badge != null && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-brand-orange)]" aria-hidden="true" />
      )}
    </button>
  );
}

// ─── stat card ────────────────────────────────────────────────────────────────

type StatVariant = 'gold' | 'green' | 'red';

function StatCard({
  label, value, pct, icon, variant, barPct,
}: {
  label: string; value: string; pct: string; icon: React.ReactNode;
  variant: StatVariant; barPct: number;
}) {
  const colors: Record<StatVariant, { bar: string; pct: string; icon: string; }> = {
    gold:  { bar: 'bg-[var(--color-brand-orange)]',  pct: 'text-[var(--color-brand-orange)]',  icon: 'bg-[var(--color-brand-orange-dim)] text-[var(--color-brand-orange)]'   },
    green: { bar: 'bg-[var(--color-income)]',         pct: 'text-[var(--color-income)]',         icon: 'bg-[var(--color-income-dim)] text-[var(--color-income)]'               },
    red:   { bar: 'bg-[var(--color-expense)]',        pct: 'text-[var(--color-expense)]',        icon: 'bg-[var(--color-expense-dim)] text-[var(--color-expense)]'             },
  };
  const c = colors[variant];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold tabular-nums ${c.pct}`}>{pct}</span>
      </div>

      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1 font-medium">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{value}</p>
      </div>

      {/* progress bar */}
      <div className="h-0.5 w-full rounded-full bg-[var(--color-border-strong)] mt-1" aria-hidden="true">
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

const ALLOC = [
  { name: 'Operasional', pct: 65, color: '#f97316' },
  { name: 'Dana Darurat', pct: 25, color: '#a78bfa' },
  { name: 'Investasi',    pct: 10, color: '#60a5fa' },
];

function AllocDonut({ total }: { total: number }) {
  const data = ALLOC.map(a => ({ ...a, value: Math.round(total * a.pct / 100) }));
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative flex items-center justify-center" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
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
          <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">TOTAL</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">100%</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {ALLOC.map(a => (
          <div key={a.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} aria-hidden="true" />
              <span className="text-[var(--color-text-secondary)]">{a.name}</span>
            </div>
            <span className="font-semibold tabular-nums" style={{ color: a.color }}>{a.pct}%</span>
          </div>
        ))}
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

  // mock category labels based on keterangan keywords
  const getCategory = (k: string) => {
    const lower = k.toLowerCase();
    if (lower.includes('server') || lower.includes('cloud') || lower.includes('it')) return 'IT Infrastructure';
    if (lower.includes('rapat') || lower.includes('konsumsi')) return 'Operasional';
    if (lower.includes('punia') || lower.includes('donasi') || lower.includes('dana')) return 'Pemasukan';
    if (lower.includes('banten') || lower.includes('upacara')) return 'Keagamaan';
    return 'Operasional';
  };

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>

      {/* ── Narrow Sidebar (icon-only) ─────────────────────────────── */}
      <aside
        className="flex flex-col items-center py-4 gap-2 shrink-0 border-r border-[var(--color-border)]"
        style={{ width: 64, background: 'var(--color-bg-surface)' }}
        aria-label="Navigasi utama"
      >
        {/* Logo */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0"
          style={{ background: 'var(--color-brand-orange)' }}
          aria-label="TransParas"
        >
          <span className="text-white font-extrabold text-base select-none leading-none">T</span>
        </div>

        <nav className="flex flex-col items-center gap-1 flex-1" aria-label="Menu">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard"    active />
          <NavItem icon={<ClipboardList   size={18} />} label="Transaksi"                  />
          <NavItem icon={<TrendingUp      size={18} />} label="Laporan"                    />
          <NavItem icon={<Shield          size={18} />} label="Keamanan"      badge={1}    />
        </nav>

        <div className="flex flex-col items-center gap-1 mt-auto">
          <NavItem icon={<Settings size={18} />} label="Pengaturan" />
          <NavItem icon={<LogOut   size={18} />} label="Keluar" />
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-7 shrink-0 border-b border-[var(--color-border)]"
          style={{ height: 60, background: 'var(--color-bg-surface)' }}
        >
          {/* Logo text */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-brand-orange)' }}
              aria-hidden="true"
            >
              <span className="text-white font-bold text-xs leading-none select-none">T</span>
            </div>
            <span className="font-bold tracking-[0.12em] text-sm text-[var(--color-text-primary)] uppercase">
              TransParas
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Connect / status */}
            {isConnected ? (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{
                  background: 'var(--color-brand-orange-dim)',
                  borderColor: 'rgba(249,115,22,0.3)',
                  color: 'var(--color-brand-orange)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: 'var(--color-brand-orange)' }}
                  aria-hidden="true"
                />
                {isOwner ? 'Bendahara Aktif' : 'Dompet Terhubung'}
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={connectWallet} className="gap-2 rounded-xl">
                <UserCircle2 size={14} aria-hidden="true" />
                Connect MetaMask
              </Button>
            )}

            <button
              aria-label="Notifikasi"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-brand-orange)' }} aria-hidden="true" />
            </button>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-bg-card-hover)', color: 'var(--color-text-secondary)' }}
              aria-label="Profil Bendahara"
            >
              B
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-7 py-6" style={{ background: 'var(--color-bg-base)' }}>

          {/* Page heading */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Data Overview
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                Status transparansi keuangan komunitas · diperbarui otomatis setiap 15 detik
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
              icon={<Building2 size={18} />}
              variant="gold"
              barPct={balance.income > 0 ? (balance.balance / balance.income) * 100 : 0}
            />
            <StatCard
              label="Total Pemasukan"
              value={idr(balance.income)}
              pct="+8.4%"
              icon={<ArrowDown size={18} />}
              variant="green"
              barPct={balance.income > 0 ? 100 : 0}
            />
            <StatCard
              label="Total Pengeluaran"
              value={idr(balance.expense)}
              pct="-2.1%"
              icon={<ArrowUp size={18} />}
              variant="red"
              barPct={balance.income > 0 ? (balance.expense / balance.income) * 100 : 0}
            />
          </div>

          {/* ── Chart row ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

            {/* Area Chart – Arus Kas Dana */}
            <div
              className="lg:col-span-2 rounded-2xl border p-5"
              style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Arus Kas Dana</h2>
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

              <div className="h-48" aria-label="Grafik arus kas dana 6 bulan terakhir">
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

            {/* Donut – Alokasi Dana */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Alokasi Dana</h2>
              <AllocDonut total={balance.balance} />
            </div>
          </div>

          {/* ── Transaction table ─────────────────────────────────────── */}
          <div
            className="rounded-2xl border"
            style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Transaksi Terbaru</h2>
              <button
                className="text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: 'var(--color-brand-orange)' }}
              >
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Tabel transaksi terbaru">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['DESKRIPSI', 'KATEGORI', 'TANGGAL', 'STATUS', 'JUMLAH'].map(h => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                        style={{ color: 'var(--color-text-muted)' }}
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
                      const cat = getCategory(tx.keterangan);
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
                              <span
                                className="font-medium truncate max-w-[160px]"
                                style={{ color: 'var(--color-text-primary)' }}
                                title={tx.keterangan}
                              >
                                {tx.keterangan}
                              </span>
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
                              {cat}
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
                            className="px-5 py-3.5 text-right font-semibold tabular-nums text-sm"
                            style={{ color: tx.isIncome ? 'var(--color-income)' : 'var(--color-expense)' }}
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

        </main>
      </div>

      {/* ── FAB – Tambah Transaksi (Bendahara only) ─────────────────── */}
      {isOwner && (
        <>
          <button
            onClick={() => setShowAddModal(true)}
            aria-label="Catat transaksi baru"
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 z-40"
            style={{ background: 'var(--color-brand-orange)' }}
          >
            <Plus size={24} className="text-white" aria-hidden="true" />
          </button>

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
                  <h2 id="modal-title" className="text-base font-bold text-[var(--color-text-primary)]">
                    Catat Transaksi Baru
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Data akan dicatat permanen di blockchain · MetaMask diperlukan
                  </p>
                </div>

                <form onSubmit={handleAdd} className="space-y-4" noValidate>
                  {/* Type toggle */}
                  <fieldset>
                    <legend className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
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
                          className="py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border"
                          style={{
                            background: isIncome === opt.value ? opt.dim : 'var(--color-bg-card-hover)',
                            color:      isIncome === opt.value ? opt.color : 'var(--color-text-secondary)',
                            borderColor: isIncome === opt.value ? opt.color : 'var(--color-border)',
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
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}
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
                      <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-text-muted)' }}>Rp</span>
                      <input
                        id="modal-nominal"
                        type="number"
                        min="1"
                        value={nominal}
                        onChange={e => setNominal(e.target.value)}
                        placeholder="500000"
                        className="flex-1 bg-transparent text-sm font-semibold outline-none"
                        style={{ color: 'var(--color-text-primary)' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label
                      htmlFor="modal-keterangan"
                      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}
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
    </div>
  );
}
