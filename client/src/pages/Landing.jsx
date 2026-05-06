import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, Tag, BarChart2,
  Users, ArrowRight, Sparkles, Star,
} from 'lucide-react';

/* ── Doodle characters for the bottom strip ── */
const DOODLES = [
  { emoji: '🛒', label: 'Cart',   delay: 0    },
  { emoji: '🥕', label: 'Carrot', delay: 0.3  },
  { emoji: '😊', label: 'Happy',  delay: 0.6  },
  { emoji: '🧃', label: 'Juice',  delay: 0.9  },
  { emoji: '👋', label: 'Wave',   delay: 1.2  },
  { emoji: '🍎', label: 'Apple',  delay: 1.5  },
  { emoji: '📦', label: 'Box',    delay: 1.8  },
  { emoji: '🎉', label: 'Party',  delay: 2.1  },
  { emoji: '🧀', label: 'Cheese', delay: 2.4  },
  { emoji: '😄', label: 'Smile',  delay: 2.7  },
  { emoji: '🥤', label: 'Drink',  delay: 3.0  },
  { emoji: '✨', label: 'Spark',  delay: 3.3  },
  { emoji: '🧺', label: 'Basket', delay: 3.6  },
  { emoji: '🌟', label: 'Star',   delay: 3.9  },
  { emoji: '🥦', label: 'Broc',   delay: 4.2  },
  { emoji: '🎊', label: 'Confet', delay: 4.5  },
];

/* ── Feature list ── */
const FEATURES = [
  { icon: Package,  label: 'Kelola Produk',        desc: 'Tambah, edit & hapus produk dengan mudah' },
  { icon: Tag,      label: 'Atur Kategori',         desc: 'Organisasi produk lebih rapi & terstruktur' },
  { icon: BarChart2,label: 'Laporan Transaksi',     desc: 'Monitor semua aktivitas penjualan real-time' },
  { icon: Users,    label: 'Multi-User & Role',     desc: 'Admin & Staff dengan hak akses berbeda' },
];

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 6,
  dur: 5 + Math.random() * 6,
}));

export default function Landing() {
  const navigate = useNavigate();
  const [typed, setTyped] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const heroRef = useRef(null);
  const fullText = 'Kelola Stok Lebih Cerdas.';

  /* typewriter effect */
  useEffect(() => {
    let i = 0;
    const tick = () => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i < fullText.length) setTimeout(tick, 65);
    };
    const t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, []);

  /* blinking cursor */
  useEffect(() => {
    const id = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(id);
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const handler = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  /* ripple on click */
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newRipple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples(p => [...p, newRipple]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== newRipple.id)), 800);
  };

  const handleEnter = (e) => {
    addRipple(e);
    setTimeout(() => navigate('/login'), 300);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8faf8',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Floating particles background ── */}
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
            opacity: 0.35,
            animation: `floatUp ${p.dur}s ease-in ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── NAVBAR ── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 40px',
          position: 'relative',
          zIndex: 10,
          borderBottom: '1px solid rgba(22,163,74,0.1)',
          background: 'rgba(248,250,248,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg,#166534,#16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
              animation: 'logoBob 3s ease-in-out infinite',
            }}
          >
            <ShoppingCart size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532d', letterSpacing: '-0.03em' }}>
            Stockmart
          </span>
        </div>

        {/* Nav right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
              color: '#16a34a', textTransform: 'uppercase',
              padding: '4px 12px', borderRadius: 99,
              background: '#dcfce7', border: '1px solid #bbf7d0',
              animation: 'pulseBadge 2s ease-in-out infinite',
            }}
          >
            ● LIVE
          </span>
          <button
            id="nav-masuk-btn"
            onClick={handleEnter}
            style={{
              padding: '10px 22px', borderRadius: 10,
              background: '#111827', color: '#fff',
              fontWeight: 700, fontSize: '0.875rem',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)'; }}
          >
            Masuk →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main
        ref={heroRef}
        style={{ position: 'relative', zIndex: 5, padding: '60px 40px 0', textAlign: 'center' }}
      >
        {/* Italic accent (like "Listen!" in reference) */}
        <p
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: '1.4rem',
            color: '#16a34a',
            marginBottom: 16,
            animation: 'fadeSlideDown 0.8s ease both',
            letterSpacing: '0.02em',
          }}
        >
          Yuk, mulai kelola!
        </p>

        {/* Big headline with typewriter */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 5rem)',
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            marginBottom: 20,
            animation: 'fadeSlideDown 0.8s 0.1s ease both',
          }}
        >
          {typed}
          <span style={{ opacity: showCursor ? 1 : 0, color: '#16a34a' }}>|</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg,#166534,#16a34a,#4ade80)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Bisnis Makin Lancar.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            maxWidth: 560,
            margin: '0 auto 36px',
            lineHeight: 1.65,
            animation: 'fadeSlideDown 0.8s 0.2s ease both',
          }}
        >
          Stockmart hadir untuk mempermudah manajemen stok supermarket Anda —
          dari produk, kategori, hingga laporan transaksi, semua dalam satu platform.
        </p>

        {/* CTA button with ripple */}
        <div style={{ animation: 'fadeSlideDown 0.8s 0.3s ease both' }}>
          <button
            id="cta-masuk-btn"
            onClick={handleEnter}
            style={{
              position: 'relative', overflow: 'hidden',
              padding: '16px 40px', borderRadius: 14,
              background: 'linear-gradient(135deg,#166534,#16a34a)',
              color: '#fff', fontWeight: 800, fontSize: '1.05rem',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 28px rgba(22,163,74,0.4)',
              transition: 'all 0.25s',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(22,163,74,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(22,163,74,0.4)'; }}
          >
            {ripples.map(r => (
              <span
                key={r.id}
                style={{
                  position: 'absolute',
                  left: r.x - 50, top: r.y - 50,
                  width: 100, height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.35)',
                  animation: 'rippleGrow 0.7s ease-out forwards',
                  pointerEvents: 'none',
                }}
              />
            ))}
            <Sparkles size={20} />
            Mulai Sekarang
            <ArrowRight size={18} />
          </button>
          <p style={{ marginTop: 12, fontSize: '0.78rem', color: '#9ca3af' }}>
            Gratis · Aman · Real-time
          </p>
        </div>

        {/* ── FLOATING FEATURE CARD (like Qatchup reference) ── */}
        <div
          style={{
            display: 'inline-block',
            marginTop: 50,
            background: '#fff',
            borderRadius: 20,
            border: '1px solid #e5f0e8',
            boxShadow: '0 20px 60px rgba(22,163,74,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            padding: '8px 0',
            minWidth: 340,
            maxWidth: 420,
            textAlign: 'left',
            animation: 'floatCard 5s ease-in-out infinite',
            transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 6}deg) rotateX(${(mousePos.y - 0.5) * -4}deg)`,
            transition: 'transform 0.15s ease',
          }}
        >
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              id={`feature-item-${i}`}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 22px',
                borderBottom: i < FEATURES.length - 1 ? '1px solid #f0fdf4' : 'none',
                borderRadius: i === 0 ? '12px 12px 0 0' : i === FEATURES.length - 1 ? '0 0 12px 12px' : 0,
                background: hoveredFeature === i ? '#f0fdf4' : 'transparent',
                transition: 'background 0.2s',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: hoveredFeature === i ? 'linear-gradient(135deg,#166534,#16a34a)' : '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.25s',
                  transform: hoveredFeature === i ? 'scale(1.12) rotate(-5deg)' : 'scale(1)',
                }}
              >
                <Icon size={18} color={hoveredFeature === i ? '#fff' : '#16a34a'} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', lineHeight: 1.2 }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{desc}</p>
              </div>
              {hoveredFeature === i && (
                <ArrowRight size={14} color="#16a34a" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Star rating like reference */}
        <div style={{ marginTop: 28, marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#facc15" color="#facc15" style={{ animation: `starPop 0.4s ${i * 0.08}s ease both` }} />
          ))}
          <span style={{ fontSize: '0.82rem', color: '#6b7280', marginLeft: 6 }}>
            Platform manajemen supermarket terpercaya
          </span>
        </div>
      </main>

      {/* ── DOODLE STRIP (Qatchup-style colorful characters) ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: 130,
          marginTop: 10,
        }}
      >
        {/* Gradient fade left & right */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, #f8faf8, transparent)', zIndex: 3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, #f8faf8, transparent)', zIndex: 3, pointerEvents: 'none' }} />

        {/* Scrolling doodle row */}
        <div style={{ display: 'flex', gap: 0, animation: 'doodleScroll 24s linear infinite', width: 'max-content' }}>
          {[...DOODLES, ...DOODLES, ...DOODLES].map((d, i) => (
            <div
              key={i}
              title={d.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: 90,
                height: 120,
                fontSize: '3.2rem',
                animation: `doodleBob 2.2s ${d.delay}s ease-in-out infinite`,
                cursor: 'pointer',
                userSelect: 'none',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.35) translateY(-10px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
            >
              {d.emoji}
            </div>
          ))}
        </div>

        {/* Green ground line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#166534,#16a34a,#4ade80,#166534)', backgroundSize: '200% 100%', animation: 'shimmerLine 3s linear infinite' }} />
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: 'center', padding: '16px 40px', borderTop: '1px solid rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg,#166534,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={11} color="#fff" />
        </div>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
          © 2026 Stockmart — Sistem Manajemen Stok Supermarket
        </span>
      </div>

      {/* ── ALL KEYFRAME ANIMATIONS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.4; }
          50%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoBob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-5px) rotate(-5deg); }
        }
        @keyframes pulseBadge {
          0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.3); }
          50%     { box-shadow: 0 0 0 6px rgba(22,163,74,0); }
        }
        @keyframes floatCard {
          0%,100% { transform: translateY(0px) perspective(1000px); }
          50%     { transform: translateY(-10px) perspective(1000px); }
        }
        @keyframes rippleGrow {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(5); opacity: 0; }
        }
        @keyframes doodleBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-14px); }
        }
        @keyframes doodleScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes starPop {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmerLine {
          from { background-position: 0% 0%; }
          to   { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  );
}
