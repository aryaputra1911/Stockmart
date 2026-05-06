import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  ShoppingCart, Eye, EyeOff, UserPlus, Lock, Mail,
  User, Leaf, CheckCircle2, XCircle, ShieldCheck, Shield, Briefcase,
} from 'lucide-react';

/* ── Password strength helper ── */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};

const STRENGTH_LABEL = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
const STRENGTH_COLOR = ['', '#ef4444', '#f59e0b', '#16a34a', '#166534'];

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 7,
  delay: Math.random() * 5,
  dur: 6 + Math.random() * 5,
}));

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '' });
  const [role, setRole] = useState('staff');
  const [showPass, setShowPass] = useState(false);
  const [showKonfirm, setShowKonfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const strength = getStrength(form.password);
  const passwordMatch = form.password && form.konfirmasi && form.password === form.konfirmasi;
  const passwordMismatch = form.konfirmasi && form.password !== form.konfirmasi;

  const rules = [
    { label: 'Minimal 8 karakter', ok: form.password.length >= 8 },
    { label: 'Mengandung huruf kapital', ok: /[A-Z]/.test(form.password) },
    { label: 'Mengandung angka', ok: /[0-9]/.test(form.password) },
  ];

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.password || !form.konfirmasi) {
      toast.error('Semua field wajib diisi.');
      return;
    }
    if (form.password !== form.konfirmasi) {
      toast.error('Password dan konfirmasi tidak cocok.');
      return;
    }
    if (strength < 2) {
      toast.error('Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        nama: form.nama,
        email: form.email,
        password: form.password,
        role,
      });
      toast.success(`Akun ${role === 'admin' ? 'Admin' : 'Staff'} berhasil dibuat! Silakan login. 🎉`);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: '#f1f5f1' }}>
      {/* ── Floating particles ── */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.id % 3 === 0 ? '#16a34a' : p.id % 3 === 1 ? '#bbf7d0' : '#dcfce7',
            opacity: 0.25,
            animation: `regFloatUp ${p.dur}s ease-in ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Left panel — branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #14532d 0%, #166534 40%, #15803d 80%, #16a34a 100%)' }}
      >
        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Animated ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 320, height: 320,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            animation: 'regRingPulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 200, height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            animation: 'regRingPulse 4s ease-in-out 1s infinite',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShoppingCart size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Stockmart</span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Leaf size={13} className="text-green-200" />
            <span className="text-green-100 text-xs font-medium">Buat Akun Baru</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Bergabung<br />
            <span style={{ color: '#86efac' }}>Bersama</span><br />
            Stockmart
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Daftarkan akun Staff baru dan mulai kelola stok supermarket dengan mudah dan efisien.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              { step: '01', label: 'Isi data akun Anda' },
              { step: '02', label: 'Buat password yang kuat' },
              { step: '03', label: 'Mulai kelola stok!' },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#86efac', border: '1px solid rgba(134,239,172,0.3)' }}>
                  {step}
                </span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Stockmart — Sistem Manajemen Stok Supermarket
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md" style={{ animation: 'regSlideUp 0.5s ease both' }}>

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}>
              <ShoppingCart size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>Stockmart</h1>
          </div>

          {/* Form card */}
          <div className="card p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} style={{ color: '#16a34a' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>
                  Buat Akun Baru
                </span>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Daftar Sekarang</h2>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                Isi formulir dan pilih tipe akun yang diinginkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                  Tipe Akun
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {/* Staff */}
                  <button
                    type="button"
                    id="role-staff-btn"
                    onClick={() => setRole('staff')}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 12,
                      border: `2px solid ${role === 'staff' ? '#16a34a' : '#e5e7eb'}`,
                      background: role === 'staff' ? '#f0fdf4' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: role === 'staff' ? 'linear-gradient(135deg,#166534,#16a34a)' : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <Briefcase size={18} color={role === 'staff' ? '#fff' : '#9ca3af'} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: role === 'staff' ? '#14532d' : '#6b7280' }}>Staff</span>
                    <span style={{ fontSize: '0.68rem', color: role === 'staff' ? '#16a34a' : '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>Kelola produk &amp; transaksi</span>
                    {role === 'staff' && <CheckCircle2 size={14} style={{ color: '#16a34a', marginTop: 2 }} />}
                  </button>

                  {/* Admin */}
                  <button
                    type="button"
                    id="role-admin-btn"
                    onClick={() => setRole('admin')}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 12,
                      border: `2px solid ${role === 'admin' ? '#7c3aed' : '#e5e7eb'}`,
                      background: role === 'admin' ? '#faf5ff' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: role === 'admin' ? 'linear-gradient(135deg,#5b21b6,#7c3aed)' : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <Shield size={18} color={role === 'admin' ? '#fff' : '#9ca3af'} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: role === 'admin' ? '#5b21b6' : '#6b7280' }}>Admin</span>
                    <span style={{ fontSize: '0.68rem', color: role === 'admin' ? '#7c3aed' : '#9ca3af', textAlign: 'center', lineHeight: 1.3 }}>Akses penuh &amp; kelola user</span>
                    {role === 'admin' && <CheckCircle2 size={14} style={{ color: '#7c3aed', marginTop: 2 }} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="reg-nama" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focusedField === 'nama' ? '#16a34a' : '#9ca3af', transition: 'color 0.2s' }} />
                  <input
                    id="reg-nama"
                    type="text"
                    value={form.nama}
                    onChange={set('nama')}
                    onFocus={() => setFocusedField('nama')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Budi"
                    className="input-field pl-10"
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focusedField === 'email' ? '#16a34a' : '#9ca3af', transition: 'color 0.2s' }} />
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="nama@stockmart.com"
                    className="input-field pl-10"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focusedField === 'password' ? '#16a34a' : '#9ca3af', transition: 'color 0.2s' }} />
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-11"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    id="toggle-reg-password-btn"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#9ca3af' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} style={{
                          flex: 1, height: 4, borderRadius: 99,
                          background: n <= strength ? STRENGTH_COLOR[strength] : '#e5e7eb',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: STRENGTH_COLOR[strength], fontWeight: 600 }}>
                      {STRENGTH_LABEL[strength]}
                    </p>
                  </div>
                )}

                {/* Password rules */}
                {form.password && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {rules.map(({ label, ok }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {ok
                          ? <CheckCircle2 size={12} style={{ color: '#16a34a', flexShrink: 0 }} />
                          : <XCircle size={12} style={{ color: '#d1d5db', flexShrink: 0 }} />}
                        <span style={{ fontSize: '0.72rem', color: ok ? '#16a34a' : '#9ca3af' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label htmlFor="reg-konfirmasi" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: focusedField === 'konfirmasi' ? '#16a34a' : '#9ca3af', transition: 'color 0.2s' }} />
                  <input
                    id="reg-konfirmasi"
                    type={showKonfirm ? 'text' : 'password'}
                    value={form.konfirmasi}
                    onChange={set('konfirmasi')}
                    onFocus={() => setFocusedField('konfirmasi')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-11"
                    disabled={loading}
                    autoComplete="new-password"
                    style={{
                      borderColor: passwordMatch ? '#16a34a' : passwordMismatch ? '#ef4444' : undefined,
                      boxShadow: passwordMatch ? '0 0 0 3px rgba(22,163,74,0.12)' : passwordMismatch ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined,
                    }}
                  />
                  <button type="button" onClick={() => setShowKonfirm(!showKonfirm)}
                    id="toggle-reg-konfirmasi-btn"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#9ca3af' }}>
                    {showKonfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordMatch && (
                  <p style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} /> Password cocok
                  </p>
                )}
                {passwordMismatch && (
                  <p style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <XCircle size={12} /> Password tidak cocok
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
                id="register-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Buat Akun
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f0fdf4' }}>
              <p className="text-center text-sm" style={{ color: '#6b7280' }}>
                Sudah punya akun?{' '}
                <Link to="/login" id="go-to-login-link"
                  className="font-semibold transition-colors"
                  style={{ color: '#16a34a' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#14532d'}
                  onMouseLeave={e => e.currentTarget.style.color = '#16a34a'}>
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes regFloatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes regSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes regRingPulse {
          0%,100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
