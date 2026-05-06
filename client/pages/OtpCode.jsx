import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart, KeyRound, Shield, Clock, Copy, Check,
  ArrowRight, ArrowLeft, Leaf, Sparkles,
} from 'lucide-react';

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 7,
  delay: Math.random() * 5,
  dur: 6 + Math.random() * 5,
}));

export default function OtpCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { code, email, expiresIn } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState((expiresIn || 15) * 60); // seconds

  // Redirect if no code present
  useEffect(() => {
    if (!code || !email) {
      navigate('/reset-password', { replace: true });
    }
  }, [code, email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isExpired = timeLeft <= 0;
  const digits = code ? code.split('') : [];

  if (!code || !email) return null;

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
            opacity: 0.22,
            animation: `otpFloatUp ${p.dur}s ease-in ${p.delay}s infinite`,
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

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Ring pulse */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 300, height: 300, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            animation: 'otpRingPulse 4s ease-in-out infinite',
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
            <Shield size={13} className="text-green-200" />
            <span className="text-green-100 text-xs font-medium">Kode Verifikasi</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Kode OTP<br />
            <span style={{ color: '#86efac' }}>Berhasil</span><br />
            Dibuat!
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Catat atau salin kode di bawah ini untuk melanjutkan proses reset password akun Anda.
          </p>

          {/* Security tips */}
          <div className="flex flex-col gap-3">
            {[
              { icon: Shield, label: 'Kode berlaku selama 15 menit' },
              { icon: KeyRound, label: 'Jangan bagikan kode ke siapapun' },
              { icon: Sparkles, label: 'Gunakan kode untuk reset password' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Icon size={14} style={{ color: '#86efac' }} />
                </div>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Stockmart — Sistem Manajemen Stok Supermarket
        </p>
      </div>

      {/* ── Right panel — OTP Display ── */}
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

          {/* OTP Card */}
          <div className="card p-8" style={{ animation: 'otpSlideUp 0.4s ease both' }}>
            {/* Header */}
            <div className="mb-6 text-center">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  border: '1px solid #86efac',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'otpIconPulse 2s ease-in-out infinite',
                }}>
                  <KeyRound size={30} style={{ color: '#16a34a' }} />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield size={16} style={{ color: '#16a34a' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#16a34a' }}>
                  Kode Verifikasi
                </span>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>Kode OTP Anda</h2>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                Gunakan kode ini di halaman reset password
              </p>
            </div>

            {/* OTP Digits */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '2px solid #bbf7d0',
              borderRadius: '1rem',
              padding: '24px 16px',
              marginBottom: 20,
            }}>
              <p style={{
                margin: '0 0 12px', textAlign: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af',
                textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                Kode Reset Password
              </p>

              <div style={{
                display: 'flex', justifyContent: 'center', gap: 8,
              }}>
                {digits.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      width: 52, height: 64, borderRadius: 12,
                      background: '#fff',
                      border: '2px solid #86efac',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.75rem', fontWeight: 900, color: '#14532d',
                      fontFamily: 'monospace',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.1)',
                      animation: `otpDigitPop 0.4s ${i * 0.08}s cubic-bezier(0.34,1.56,0.64,1) both`,
                    }}
                  >
                    {isExpired ? '•' : d}
                  </div>
                ))}
              </div>

              {/* Timer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, marginTop: 16,
              }}>
                <Clock size={14} style={{ color: isExpired ? '#ef4444' : '#16a34a' }} />
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: isExpired ? '#ef4444' : timeLeft <= 120 ? '#f59e0b' : '#16a34a',
                  fontFamily: 'monospace',
                }}>
                  {isExpired ? 'Kode sudah kadaluarsa' : `Berlaku ${formatTime(timeLeft)}`}
                </span>
              </div>
            </div>

            {/* Copy Button */}
            {!isExpired && (
              <button
                onClick={handleCopy}
                id="copy-otp-btn"
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  border: '1.5px solid #bbf7d0',
                  background: copied ? '#f0fdf4' : '#fff',
                  color: copied ? '#16a34a' : '#374151',
                  fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginBottom: 16,
                }}
                onMouseEnter={e => {
                  if (!copied) {
                    e.currentTarget.style.background = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#86efac';
                  }
                }}
                onMouseLeave={e => {
                  if (!copied) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#bbf7d0';
                  }
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} style={{ color: '#16a34a' }} />
                    Kode berhasil disalin!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Salin Kode OTP
                  </>
                )}
              </button>
            )}

            {/* Action Button — go to reset password step 2 */}
            <button
              onClick={() => navigate('/reset-password', {
                state: { email, code, fromOtpPage: true },
              })}
              className="btn-primary w-full justify-center py-3 text-base"
              id="continue-reset-btn"
            >
              {isExpired ? (
                <>
                  <ArrowLeft size={17} />
                  Minta Kode Baru
                </>
              ) : (
                <>
                  <ArrowRight size={17} />
                  Lanjutkan Reset Password
                </>
              )}
            </button>

            {/* Email info */}
            <div style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 10,
              background: '#f9fafb', textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af' }}>
                Kode untuk akun
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                {email}
              </p>
            </div>

            {/* Back link */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #f0fdf4' }}>
              <Link to="/login" id="back-to-login-from-otp"
                className="flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                <ArrowLeft size={15} /> Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes otpFloatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.25; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes otpSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes otpRingPulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.9; transform: translate(-50%,-50%) scale(1.05); }
        }
        @keyframes otpDigitPop {
          from { transform: scale(0) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes otpIconPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}
