import { useState, useEffect, useRef } from 'react';
import { useWallet } from '../features/blockchain/WalletContext';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/ToastContext';
import { 
  Edit3, Save, X, Copy, Camera, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { authApi } from '../features/auth/api/authApi';
import { api } from '../lib/axios';

interface BanjarProfile {
  name: string;
  address: string;
  foundedYear: string;
  membersCount: string;
  description: string;
  leaderName: string;
  treasurerName: string;
  secretaryName: string;
  logoUrl?: string;
}

const DEFAULT_PROFILE: BanjarProfile = {
  name: "Banjar Adat TransParas",
  address: "Jalan Tunon No 35, Mengwi, Badung",
  foundedYear: "1990",
  membersCount: "150",
  description: "Banjar adat percontohan yang menggunakan teknologi blockchain untuk transparansi kas dan dana punia.",
  leaderName: "I Wayan Budiarta",
  treasurerName: "Ni Made Susanti",
  secretaryName: "I Nyoman Wirawan",
  logoUrl: "/logo.png"
};

export default function ProfilePage() {
  const { address: walletAddress, isConnected } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const isAdmin = !!localStorage.getItem('token');
  
  const [profile, setProfile] = useState<BanjarProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<BanjarProfile>(DEFAULT_PROFILE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || 'Belum diatur';

  // Load from Backend API on mount
  useEffect(() => {
    document.title = 'Profil Organisasi | TransParas';
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data;
        setProfile(data);
        
        // Restore draft if exists
        const draftStr = localStorage.getItem('profileDraft');
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            if (draft.isEditing) {
              setEditForm(draft.editForm);
              setIsEditing(true);
            } else {
              setEditForm(data);
            }
          } catch {
            setEditForm(data);
          }
        } else {
          setEditForm(data);
        }
      } catch (error) {
        console.error("Gagal load profile dari backend:", error);
      }
    };
    fetchProfile();
  }, []);

  // Save draft whenever editForm or isEditing changes
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem('profileDraft', JSON.stringify({ editForm, isEditing }));
    } else {
      localStorage.removeItem('profileDraft');
    }
  }, [editForm, isEditing]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Berhasil disalin ke clipboard!', 'success');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
      toast('Berhasil keluar', 'success');
    } catch (error) {
      console.error('Logout failed:', error);
      toast('Gagal keluar', 'error');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setEditForm(profile);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      
      formData.append('name', editForm.name);
      formData.append('address', editForm.address);
      formData.append('foundedYear', editForm.foundedYear);
      formData.append('membersCount', editForm.membersCount);
      formData.append('description', editForm.description);
      formData.append('leaderName', editForm.leaderName);
      formData.append('treasurerName', editForm.treasurerName);
      formData.append('secretaryName', editForm.secretaryName);

      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      const response = await api.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      setProfile(result.data);
      setEditForm(result.data);
      
      // Notify other components (like Topbar) about the logo change
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: result.data.logoUrl }));
      
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast('Profil organisasi berhasil diperbarui!', 'success');
    } catch (error: unknown) {
      console.error(error);
      const err = error as Error;
      toast(err.message || 'Terjadi kesalahan saat menyimpan profil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BanjarProfile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Section (Profile Avatar & Quick Info) */}
      <div className="flex flex-col relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-[var(--color-bg-surface)] overflow-hidden shadow-lg relative shrink-0 bg-[var(--color-bg-card)]">
              <img 
                src={previewUrl || profile.logoUrl || '/logo.png'} 
                alt="Logo Banjar" 
                className="w-full h-full object-cover" 
              />
              {isEditing && (
                <div 
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={20} className="text-white mb-1" />
                  <span className="text-[8px] text-white font-bold tracking-wider">UBAH LOGO</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl text-[var(--color-text-primary)] font-bold tracking-tight">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => handleChange('name', e.target.value)}
                      className="bg-transparent border-b border-[var(--color-border-strong)] focus:outline-none focus:border-[var(--color-brand-orange)] pb-1 w-full max-w-[200px] sm:max-w-md"
                    />
                  ) : profile.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-1">{profile.address}</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              variant={isEditing ? "outline" : "outline"}
              onClick={handleEditToggle}
              className="rounded-full px-5 gap-2 shrink-0 h-9 font-semibold text-xs transition-colors hover:bg-[var(--color-bg-card)]"
              style={{ borderColor: 'var(--color-border-strong)' }}
              disabled={isSaving}
            >
              {isEditing ? (
                <><X size={14} /> Batal</>
              ) : (
                <><Edit3 size={14} /> Edit</>
              )}
            </Button>
          )}
        </div>

        {/* Section: Organisasi Details */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 px-2">Detail Organisasi</h2>
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border)]">
            <DetailRow 
              label="Alamat Lengkap" 
              value={profile.address} 
              isEditing={isEditing} 
              editValue={editForm.address} 
              onChange={(val) => handleChange('address', val)} 
              isTextArea 
            />
            <DetailRow 
              label="Tahun Berdiri" 
              value={profile.foundedYear} 
              isEditing={isEditing} 
              editValue={editForm.foundedYear} 
              onChange={(val) => handleChange('foundedYear', val)} 
            />
            <DetailRow 
              label="Jumlah KK" 
              value={`${profile.membersCount} Kepala Keluarga`} 
              isEditing={isEditing} 
              editValue={editForm.membersCount} 
              onChange={(val) => handleChange('membersCount', val)} 
            />
            <DetailRow 
              label="Deskripsi Singkat" 
              value={profile.description} 
              isEditing={isEditing} 
              editValue={editForm.description} 
              onChange={(val) => handleChange('description', val)} 
              isTextArea 
            />
          </div>
        </div>

        {/* Section: Pengurus Inti */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 px-2">Pengurus Inti</h2>
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border)]">
            <DetailRow 
              label="Kelian Banjar" 
              value={profile.leaderName} 
              isEditing={isEditing} 
              editValue={editForm.leaderName} 
              onChange={(val) => handleChange('leaderName', val)} 
            />
            <DetailRow 
              label="Bendahara" 
              value={profile.treasurerName} 
              isEditing={isEditing} 
              editValue={editForm.treasurerName} 
              onChange={(val) => handleChange('treasurerName', val)} 
            />
            <DetailRow 
              label="Sekretaris" 
              value={profile.secretaryName} 
              isEditing={isEditing} 
              editValue={editForm.secretaryName} 
              onChange={(val) => handleChange('secretaryName', val)} 
            />
          </div>
        </div>

        {/* Section: Identitas Web3 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 px-2">Pengaturan Keamanan & Web3</h2>
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border)]">
            <div className="flex flex-col sm:flex-row sm:items-start py-5 px-6 gap-4 transition-colors hover:bg-[var(--color-bg-card)]/30">
              <div className="sm:w-1/3 text-sm font-medium text-[var(--color-text-muted)] pt-0.5">Smart Contract</div>
              <div className="sm:w-2/3">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs text-[var(--color-text-primary)] break-all leading-relaxed">{contractAddress}</div>
                  {contractAddress !== 'Belum diatur' && (
                    <button onClick={() => handleCopy(contractAddress)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0" title="Salin Address">
                      <Copy size={14} />
                    </button>
                  )}
                </div>
                {contractAddress !== 'Belum diatur' && (
                  <a 
                    href={`https://amoy.polygonscan.com/address/${contractAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-brand-orange)] mt-2 inline-block hover:underline font-semibold"
                  >
                    Lihat di Polygon Amoy Explorer
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start py-5 px-6 gap-4 transition-colors hover:bg-[var(--color-bg-card)]/30">
              <div className="sm:w-1/3 text-sm font-medium text-[var(--color-text-muted)] pt-0.5">Dompet Terkoneksi</div>
              <div className="sm:w-2/3">
                {isConnected && walletAddress ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-income)] shrink-0" />
                      <span className="font-mono text-xs text-[var(--color-text-primary)] break-all">{walletAddress}</span>
                      <button onClick={() => handleCopy(walletAddress)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors shrink-0" title="Salin Address">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-expense)] font-medium">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-expense)] shrink-0" />
                    Belum Terhubung
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Zona Berbahaya / Logout */}
        {!isEditing && isAdmin && (
          <div className="mt-12 flex justify-center border-t border-[var(--color-border)] pt-8">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-xl px-6 py-2.5 gap-2 text-[var(--color-expense)] border-[var(--color-expense)]/50 hover:border-[var(--color-expense)] hover:bg-[var(--color-expense)]/10 font-medium transition-colors"
            >
              <LogOut size={18} />
              Keluar dari Akun
            </Button>
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end sticky bottom-8 mt-6">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="rounded-full px-8 py-3 gap-2 h-auto text-sm shadow-xl shadow-[var(--color-brand-orange)]/20 hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper component for rows
function DetailRow({ 
  label, value, isEditing, editValue, onChange, isTextArea 
}: { 
  label: string, value: string, isEditing: boolean, editValue: string, onChange: (val: string) => void, isTextArea?: boolean 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-5 px-6 gap-4 transition-colors hover:bg-[var(--color-bg-card)]/30">
      <div className="sm:w-1/3 text-sm font-medium text-[var(--color-text-muted)] pt-1.5">{label}</div>
      <div className="sm:w-2/3">
        {isEditing ? (
          isTextArea ? (
            <textarea 
              value={editValue} 
              onChange={e => onChange(e.target.value)}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] min-h-[100px] transition-colors"
            />
          ) : (
            <input 
              type="text" 
              value={editValue} 
              onChange={e => onChange(e.target.value)}
              className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border-strong)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
            />
          )
        ) : (
          <div className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed pt-1.5">{value}</div>
        )}
      </div>
    </div>
  );
}
