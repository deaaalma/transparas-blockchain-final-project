import { useEffect, useState, useMemo } from 'react';
import { useWallet } from '../features/blockchain/WalletContext';
import type { Transaction } from '../hooks/useBlockchain';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign } from 'lucide-react';
import ChatWidget from '../components/ChatWidget/ChatWidget';

// ─── helpers ──────────────────────────────────────────────────────────────────
const idr = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n);
const shortMonth = (d: Date) => format(d, 'MMM', { locale: idLocale });

// ─── color constants ──────────────────────────────────────────────────────────
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

// Parse tags like "[Donasi] ..." into category
const parseDescription = (raw: string) => {
  const match = raw.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    return { category: match[1], description: match[2] };
  }
  return { category: 'Lainnya', description: raw };
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

// ─── custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-3 text-xs shadow-xl">
      <p className="text-[var(--color-text-secondary)] mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {idr(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── main page component ──────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { getTransactions, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTx = async () => {
      try {
        setIsLoading(true);
        const txs = await getTransactions();
        if (mounted) {
          setTransactions(txs);
        }
      } catch (err) {
        console.error("Failed to fetch txs:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchTx();
    return () => { mounted = false; };
  }, [getTransactions, isConnected]);

  // Parse transactions
  const parsedTxs = useMemo(() => transactions.map(t => ({
    ...t,
    ...parseDescription(t.keterangan)
  })), [transactions]);

  // Calculate Insights
  const { totalIncome, totalExpense, avgIncome, avgExpense, maxExpenseCategory, maxExpenseValue } = useMemo(() => {
    let inc = 0, exp = 0;
    let incCount = 0, expCount = 0;
    const expCategories: Record<string, number> = {};

    parsedTxs.forEach(t => {
      if (t.isIncome) {
        inc += t.nominal;
        incCount++;
      } else {
        exp += t.nominal;
        expCount++;
        // map Konsumsi to Operasional as in HomePage
        let cat = t.category;
        if (cat === 'Konsumsi') cat = 'Operasional';
        expCategories[cat] = (expCategories[cat] || 0) + t.nominal;
      }
    });

    let maxCat = 'Belum ada';
    let maxVal = 0;
    for (const [c, v] of Object.entries(expCategories)) {
      if (v > maxVal) { maxVal = v; maxCat = c; }
    }

    return {
      totalIncome: inc,
      totalExpense: exp,
      avgIncome: incCount > 0 ? inc / incCount : 0,
      avgExpense: expCount > 0 ? exp / expCount : 0,
      maxExpenseCategory: maxCat,
      maxExpenseValue: maxVal
    };
  }, [parsedTxs]);

  // Prepare Bar Chart Data (Last 6 Months)
  const barChartData = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return {
        name: shortMonth(d),
        month: d.getMonth(),
        year: d.getFullYear(),
        Pemasukan: 0,
        Pengeluaran: 0
      };
    });

    parsedTxs.forEach(tx => {
      const d = new Date(tx.timestamp);
      const m = d.getMonth();
      const y = d.getFullYear();
      const slot = months.find(x => x.month === m && x.year === y);
      if (slot) {
        if (tx.isIncome) slot.Pemasukan += tx.nominal;
        else slot.Pengeluaran += tx.nominal;
      }
    });
    return months;
  }, [parsedTxs]);

  // Prepare Donut Chart Data
  const { incomeData, expenseData } = useMemo(() => {
    const incMap: Record<string, number> = {};
    const expMap: Record<string, number> = {};

    parsedTxs.forEach(tx => {
      let cat = tx.category;
      if (!tx.isIncome && cat === 'Konsumsi') cat = 'Operasional';
      
      if (tx.isIncome) {
        incMap[cat] = (incMap[cat] || 0) + tx.nominal;
      } else {
        expMap[cat] = (expMap[cat] || 0) + tx.nominal;
      }
    });

    const formatDonut = (map: Record<string, number>) => 
      Object.entries(map).map(([name, value]) => ({
        name, value, color: COLORS[name] || '#6b7280'
      })).sort((a, b) => b.value - a.value);

    return {
      incomeData: formatDonut(incMap),
      expenseData: formatDonut(expMap)
    };
  }, [parsedTxs]);

  const systemPrompt = `
Kamu adalah asisten keuangan AI untuk TransParas, platform transparansi keuangan organisasi Bali berbasis blockchain (Polygon Amoy Testnet).

Laporan yang sedang dilihat pengguna:
- Organisasi: Organisasi TransParas
- Total Pemasukan: ${idr(totalIncome)}
- Total Pengeluaran: ${idr(totalExpense)}
- Saldo Akhir: ${idr(totalIncome - totalExpense)}
- Kategori pengeluaran terbesar: ${maxExpenseCategory} (${idr(maxExpenseValue)})

Aturan:
1. Jelaskan kondisi keuangan dengan bahasa yang mudah dipahami anggota banjar/sekaa.
2. Sorot kategori pengeluaran signifikan dan berikan insight singkat.
3. Jawab pertanyaan hanya berdasarkan data di atas — jangan mengarang angka.
4. Gunakan bahasa Indonesia yang ramah dan lugas.
5. Jawaban ringkas, maksimal 4 kalimat kecuali diminta detail.
  `.trim();

  const initialMessage = `Halo! Aku adalah asisten AI TransParas. Berdasarkan data saat ini, total pemasukan adalah **${idr(totalIncome)}** dan pengeluaran terbesar ada di **${maxExpenseCategory}** (${idr(maxExpenseValue)}). Ada yang ingin kamu tanyakan tentang data keuangan ini?`;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-7 py-8 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[var(--color-text-primary)] tracking-tight mb-2" style={{ fontWeight: 'var(--fw-bold)' }}>
          Analytics & Insights
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Analisis mendalam mengenai arus kas dan distribusi dana organisasi.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-[var(--color-border-strong)] border-t-[var(--color-brand-orange)]" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Rata-rata Pemasukan" value={idr(avgIncome)} pct="+14%" icon={<ArrowUp size={20} />} variant="green" barPct={75} />
            <StatCard label="Rata-rata Pengeluaran" value={idr(avgExpense)} pct="-5%" icon={<ArrowDown size={20} />} variant="red" barPct={40} />
            <StatCard label="Volume Transaksi" value={idr(totalIncome + totalExpense)} pct="100%" icon={<TrendingUp size={20} />} variant="gold" barPct={100} />
            <StatCard label="Pengeluaran Terbesar" value={maxExpenseCategory} pct="MAX" icon={<DollarSign size={20} />} variant="red" barPct={90} />
          </div>

          {/* Bar Chart Section */}
          <div className="rounded-2xl border p-6 flex flex-col min-h-[350px]" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-lg text-[var(--color-text-primary)] mb-6" style={{ fontWeight: 'var(--fw-bold)' }}>Perbandingan Pemasukan & Pengeluaran</h2>
            <div className="flex-1 min-h-[250px]" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-strong)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(0) + 'jt' : String(v)} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Pemasukan" fill="var(--color-brand-orange)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Pengeluaran" fill="#6b6573" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pemasukan Donut */}
            <div className="rounded-2xl border p-6 flex flex-col" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg text-[var(--color-text-primary)] mb-4" style={{ fontWeight: 'var(--fw-bold)' }}>Distribusi Pemasukan</h2>
              {incomeData.length === 0 ? (
                <p className="text-center text-sm text-[var(--color-text-muted)] italic py-10">Belum ada pemasukan</p>
              ) : (
                <div className="relative flex items-center justify-center h-[250px] w-full" style={{ minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incomeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {incomeData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Legend below */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {incomeData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[var(--color-text-secondary)]">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengeluaran Donut */}
            <div className="rounded-2xl border p-6 flex flex-col" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="text-lg text-[var(--color-text-primary)] mb-4" style={{ fontWeight: 'var(--fw-bold)' }}>Distribusi Pengeluaran</h2>
              {expenseData.length === 0 ? (
                <p className="text-center text-sm text-[var(--color-text-muted)] italic py-10">Belum ada pengeluaran</p>
              ) : (
                <div className="relative flex items-center justify-center h-[250px] w-full" style={{ minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {expenseData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Legend below */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {expenseData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[var(--color-text-secondary)]">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
      <ChatWidget systemPrompt={systemPrompt} initialMessage={initialMessage} />
    </div>
  );
}

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
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 flex flex-col gap-4 relative overflow-hidden shrink-0">
      <div className="flex items-center justify-between">
        <span className="flex items-center justify-center text-[var(--color-text-muted)]" aria-hidden="true">
          {icon}
        </span>
        <span className={`text-xs tabular-nums rounded-full px-2 py-0.5 ${c.pct}`} style={{ fontWeight: 'var(--fw-medium)', background: 'rgba(255,255,255,0.05)' }}>
          {pct}
        </span>
      </div>

      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1.5 uppercase" style={{ fontWeight: 'var(--fw-light)', letterSpacing: '0.07em' }}>
          {label}
        </p>
        <p className="text-3xl tracking-tight text-[var(--color-text-primary)] tabular-nums leading-none" style={{ fontWeight: 'var(--fw-extrabold)' }}>
          {value}
        </p>
      </div>

      <div className="h-px w-full rounded-full bg-[var(--color-border-strong)]" aria-hidden="true">
        <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${Math.min(barPct, 100)}%` }} />
      </div>
    </div>
  );
}
