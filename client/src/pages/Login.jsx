import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Eye, EyeOff, LogIn, Lock, Mail, Leaf, ShoppingBag } from 'lucide-react';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Selamat datang, ${user.nama}! 👋`);
      navigate('/app/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: '#f1f5f1' }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #14532d 0%, #166534 40%, #15803d 80%, #16a34a 100%)' }}
      >
        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

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
            <span className="text-green-100 text-xs font-medium">Fresh Market Management</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Kelola Stok<br />
            <span style={{ color: '#86efac' }}>Lebih Cerdas</span><br />
            & Efisien
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Sistem manajemen stok supermarket modern untuk Admin & Staff. Monitor produk, kategori, dan transaksi secara real-time.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['📦 CRUD Produk', '🏷️ Kategori', '📊 Transaksi', '👥 Multi-User'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Stockmart — Sistem Manajemen Stok Supermarket
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">

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
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={18} style={{ color: '#16a34a' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>
                  Portal Login
                </span>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Selamat Datang</h2>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@stockmart.com"
                    className="input-field pl-10"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-11"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#9ca3af' }}
                    id="toggle-password-btn"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
                id="login-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={17} />
                    Masuk ke Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f0fdf4' }}>
              <p className="text-center text-sm" style={{ color: '#6b7280' }}>
                Lupa password?{' '}
                <Link to="/reset-password" id="go-to-reset-link"
                  className="font-semibold transition-colors"
                  style={{ color: '#16a34a' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#14532d'}
                  onMouseLeave={e => e.currentTarget.style.color = '#16a34a'}>
                  Reset di sini
                </Link>
              </p>
              <p className="text-center text-sm mt-2" style={{ color: '#6b7280' }}>
                Belum punya akun?{' '}
                <Link to="/register" id="go-to-register-link"
                  className="font-semibold transition-colors"
                  style={{ color: '#16a34a' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#14532d'}
                  onMouseLeave={e => e.currentTarget.style.color = '#16a34a'}>
                  Daftar sekarang
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
