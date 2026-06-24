import { useState } from 'react';
import { Shield, Lock, Bell, Globe, Database, Key } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('umum');

  const tabs = [
    { id: 'umum', label: 'Umum', icon: Globe },
    { id: 'keamanan', label: 'Keamanan & Akses', icon: Shield },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { id: 'blockchain', label: 'Koneksi Blockchain', icon: Database },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-7 py-8 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[var(--color-text-primary)] tracking-tight mb-2" style={{ fontWeight: 'var(--fw-bold)' }}>
          Pengaturan Sistem
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Kelola preferensi akun, keamanan, dan koneksi jaringan blockchain.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Horizontal Nav */}
        <div className="flex flex-row gap-1 overflow-x-auto border-b" style={{ borderColor: 'var(--color-border)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[1px] ${
                  isActive 
                    ? 'border-[var(--color-brand-orange)] text-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5' 
                    : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]'
                }`}
                style={isActive ? { borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' } : { borderRadius: '0.5rem' }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl">
          {activeTab === 'umum' && <GeneralSettings />}
          {activeTab === 'keamanan' && <SecuritySettings />}
          {activeTab === 'notifikasi' && <NotificationSettings />}
          {activeTab === 'blockchain' && <BlockchainSettings />}
        </div>
      </div>
    </div>
  );
}

// ─── Sub Components ─────────────────────────────────────────────────────────

function GeneralSettings() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Preferensi Tampilan</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bahasa Aplikasi</label>
            <select className="w-full md:w-1/2 h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors" style={{ borderColor: 'var(--color-border-strong)' }}>
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English (US)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Format Mata Uang</label>
            <select className="w-full md:w-1/2 h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors" style={{ borderColor: 'var(--color-border-strong)' }}>
              <option value="idr">Rupiah (Rp)</option>
              <option value="usd">US Dollar ($)</option>
            </select>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button variant="primary">Simpan Perubahan</Button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[var(--color-expense)]/10 text-[var(--color-expense)] rounded-lg">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Ubah Kata Sandi</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Pastikan kata sandi baru Anda kuat dan aman.</p>
          </div>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Kata Sandi Saat Ini</label>
            <input type="password" placeholder="Masukkan kata sandi lama" className="w-full h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors" style={{ borderColor: 'var(--color-border-strong)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Kata Sandi Baru</label>
            <input type="password" placeholder="Buat kata sandi baru" className="w-full h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors" style={{ borderColor: 'var(--color-border-strong)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Konfirmasi Kata Sandi Baru</label>
            <input type="password" placeholder="Ketik ulang kata sandi baru" className="w-full h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors" style={{ borderColor: 'var(--color-border-strong)' }} />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <Button variant="primary">Perbarui Kata Sandi</Button>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Preferensi Email & Notifikasi</h2>
        
        <div className="space-y-5">
          <ToggleRow title="Laporan Bulanan" desc="Kirim ringkasan laporan keuangan via email setiap akhir bulan." defaultChecked={true} />
          <ToggleRow title="Peringatan Saldo Rendah" desc="Notifikasi jika saldo kas organisasi berada di bawah batas minimum." defaultChecked={true} />
          <ToggleRow title="Transaksi Tidak Dikenal" desc="Peringatan keamanan jika ada transaksi yang mencurigakan." defaultChecked={false} />
        </div>
      </div>
    </div>
  );
}

function BlockchainSettings() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border p-6" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] rounded-lg">
            <Key size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Konfigurasi RPC & Kontrak</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Pengaturan ini hanya untuk developer atau admin teknis.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Polygon RPC Endpoint URL</label>
            <input type="text" defaultValue="https://rpc-amoy.polygon.technology" className="w-full h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors opacity-70" style={{ borderColor: 'var(--color-border-strong)' }} readOnly />
            <p className="text-[11px] text-[var(--color-text-muted)] mt-2">Digunakan untuk membaca data dari jaringan secara publik.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Alamat Smart Contract (TransParas)</label>
            <input type="text" defaultValue="0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62" className="w-full h-12 px-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors opacity-70" style={{ borderColor: 'var(--color-border-strong)' }} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UI Helper ──────────────────────────────────────────────────────────────

function ToggleRow({ title, desc, defaultChecked }: { title: string, desc: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-dashed last:border-0" style={{ borderColor: 'var(--color-border)' }}>
      <div className="pr-4">
        <p className="text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{desc}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-bg-surface)]'} border border-[var(--color-border-strong)]`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
