import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  ShoppingCart, Mail, ArrowLeft, Send, KeyRound,
  Eye, EyeOff, CheckCircle2, Lock, Leaf, RefreshCw, ShieldCheck,
} from 'lucide-react';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, x: Math.random() * 100, size: 4 + Math.random() * 7,
  delay: Math.random() * 5, dur: 6 + Math.random() * 5,
}));

const STEPS = [
  { n: 1, label: 'Masukkan email akun Anda' },
  { n: 2, label: 'Verifikasi kode OTP' },
  { n: 3, label: 'Buat password baru' },
  { n: 4, label: 'Akun berhasil dipulihkan!' },
];

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* Tahap 1-3: Request OTP → email dikirim */
  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    if (!email) { toast.error('Email wajib diisi.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password/request', { email });
      if (res.data.fallbackCode) {
        toast.success(`Kode OTP Anda: ${res.data.fallbackCode}`, { duration: 15000 });
      } else {
        toast.success('Kode OTP dikirim! Periksa email Anda. 📬');
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Email tidak ditemukan.');
    } finally { setLoading(false); }
  };

  /* Tahap 4: Verifikasi OTP → dapat temporary token */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) { toast.error('Kode OTP wajib diisi.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password/verify', { email, code });
      setResetToken(res.data.resetToken);
      toast.success('Kode berhasil diverifikasi! ✅');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Kode tidak valid atau sudah kadaluarsa.');
    } finally { setLoading(false); }
  };

  /* Tahap 5: Reset password menggunakan temporary token */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) { toast.error('Password baru wajib diisi.'); return; }
    if (newPassword.length < 8) { toast.error('Password minimal 8 karakter.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password/confirm', { resetToken, newPassword });
      toast.success('Password berhasil direset! Silakan login. ✅');
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mereset password.');
    } finally { setLoading(false); }
  };

  const inputClass = (field) => ({
    color: focusedField === field ? '#16a34a' : '#9ca3af', transition: 'color 0.2s',
  });

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: '#f1f5f1' }}>
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'fixed', left: `${p.x}%`, bottom: '-20px',
          width: `${p.size}px`, height: `${p.size}px`, borderRadius: '50%',
          background: p.id % 3 === 0 ? '#16a34a' : p.id % 3 === 1 ? '#bbf7d0' : '#dcfce7',
          opacity: 0.22, animation: `rpFloatUp ${p.dur}s ease-in ${p.delay}s infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #14532d 0%, #166534 40%, #15803d 80%, #16a34a 100%)' }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', animation: 'rpRingPulse 4s ease-in-out infinite' }} />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShoppingCart size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Stockmart</span>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Leaf size={13} className="text-green-200" />
            <span className="text-green-100 text-xs font-medium">Pemulihan Akun</span>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Lupa<br /><span style={{ color: '#86efac' }}>Password?</span><br />Tenang!
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Kami akan membantu Anda memulihkan akses ke akun Stockmart Anda dalam beberapa langkah mudah.
          </p>

          <div className="flex flex-col gap-4">
            {STEPS.map(({ n, label }) => {
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className="flex items-center gap-3">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? '#4ade80' : active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    border: `1.5px solid ${done ? '#4ade80' : active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
                    transition: 'all 0.4s',
                  }}>
                    {done
                      ? <CheckCircle2 size={16} style={{ color: '#14532d' }} />
                      : <span style={{ fontSize: '0.75rem', fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.4)' }}>{n}</span>
                    }
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: done ? '#86efac' : active ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    fontWeight: active ? 600 : 400, transition: 'all 0.4s',
                  }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Stockmart — Sistem Manajemen Stok Supermarket
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}>
              <ShoppingCart size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>Stockmart</h1>
          </div>

          {/* Step 1 — Request OTP */}
          {step === 1 && (
            <div className="card p-8" style={{ animation: 'rpSlideUp 0.4s ease both' }}>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '1px solid #86efac' }}>
                  <Mail size={26} style={{ color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={16} style={{ color: '#16a34a' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>Tahap 1</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Masukkan Email</h2>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Kami akan mengirimkan kode OTP 6 digit ke email Anda</p>
              </div>
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Email Terdaftar</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={inputClass('email')} />
                    <input id="reset-email" type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      placeholder="nama@stockmart.com" className="input-field pl-10"
                      disabled={loading} autoComplete="email" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base" id="send-reset-code-btn">
                  {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>)
                    : (<><Send size={17} /> Kirim Kode OTP</>)}
                </button>
              </form>
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f0fdf4' }}>
                <Link to="/login" id="back-to-login-link-1" className="flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: '#6b7280' }} onMouseEnter={e => e.currentTarget.style.color = '#16a34a'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  <ArrowLeft size={15} /> Kembali ke Login
                </Link>
              </div>
            </div>
          )}

          {/* Step 2 — Verifikasi OTP */}
          {step === 2 && (
            <div className="card p-8" style={{ animation: 'rpSlideUp 0.4s ease both' }}>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '1px solid #86efac' }}>
                  <ShieldCheck size={26} style={{ color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={16} style={{ color: '#16a34a' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>Tahap 2</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Verifikasi OTP</h2>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                  Masukkan kode 6 digit yang dikirim ke <strong style={{ color: '#374151' }}>{email}</strong>
                </p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#ef4444' }}>⏰ Kode berlaku selama 5 menit</p>
              </div>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label htmlFor="reset-code" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Kode OTP</label>
                  <input id="reset-code" type="text" value={code}
                    onChange={e => setCode(e.target.value)}
                    onFocus={() => setFocusedField('code')} onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan kode 6 digit" className="input-field text-center font-mono tracking-widest text-lg"
                    maxLength={6} disabled={loading} style={{ letterSpacing: '0.35em' }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base" id="verify-otp-btn">
                  {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memverifikasi...</>)
                    : (<><ShieldCheck size={17} /> Verifikasi Kode</>)}
                </button>
              </form>
              <div className="mt-4 flex justify-between items-center pt-4" style={{ borderTop: '1px solid #f0fdf4' }}>
                <button onClick={() => setStep(1)} id="back-to-step1-btn"
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#374151'} onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                  <ArrowLeft size={14} /> Ganti email
                </button>
                <button onClick={handleRequestCode} id="resend-code-btn" disabled={loading}
                  className="text-sm font-semibold transition-colors"
                  style={{ color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#14532d'} onMouseLeave={e => e.currentTarget.style.color = '#16a34a'}>
                  Kirim ulang kode
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Buat Password Baru */}
          {step === 3 && (
            <div className="card p-8" style={{ animation: 'rpSlideUp 0.4s ease both' }}>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '1px solid #86efac' }}>
                  <Lock size={26} style={{ color: '#16a34a' }} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={16} style={{ color: '#16a34a' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>Tahap 3</span>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Password Baru</h2>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Buat password baru untuk akun Anda</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-new-password" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Password Baru</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={inputClass('newPass')} />
                    <input id="reset-new-password" type={showPass ? 'text' : 'password'} value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      onFocus={() => setFocusedField('newPass')} onBlur={() => setFocusedField(null)}
                      placeholder="Minimal 8 karakter" className="input-field pl-10 pr-11"
                      disabled={loading} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} id="toggle-new-password-btn"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#9ca3af' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base" id="confirm-reset-btn">
                  {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>)
                    : (<><RefreshCw size={17} /> Reset Password</>)}
                </button>
              </form>
            </div>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="card p-8 text-center" style={{ animation: 'rpSlideUp 0.4s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#166534,#16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(22,163,74,0.35)',
                  animation: 'rpSuccessPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                }}>
                  <CheckCircle2 size={40} color="#fff" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#14532d' }}>Password Direset!</h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
                Password akun Anda berhasil diperbarui. Silakan login dengan password baru.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
                {['#16a34a', '#facc15', '#3b82f6', '#ec4899', '#16a34a'].map((c, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: c,
                    animation: `rpConfetti 0.6s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  }} />
                ))}
              </div>
              <button onClick={() => navigate('/login')} className="btn-primary w-full justify-center py-3 text-base" id="go-to-login-after-reset-btn">
                Masuk Sekarang →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes rpFloatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.25; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes rpSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpRingPulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.9; transform: translate(-50%,-50%) scale(1.05); }
        }
        @keyframes rpSuccessPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes rpConfetti {
          from { transform: translateY(0) scale(0); opacity: 0; }
          to   { transform: translateY(-12px) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
