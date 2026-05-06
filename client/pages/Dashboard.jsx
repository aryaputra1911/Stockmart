import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Package, Tag, AlertTriangle, TrendingUp,
  ArrowRight, RefreshCw, ShoppingCart, Activity,
  Zap, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

/* ── Ticker items ──────────────────────────────────────── */
const tickerItems = [
  '✦ STOK REAL-TIME', '✦ MANAJEMEN PRODUK', '✦ LAPORAN TRANSAKSI',
  '✦ KATEGORI LENGKAP', '✦ MULTI-USER', '✦ STOCKMART SYSTEM',
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/produk/stats');
      setStats(res.data);
    } catch {
      toast.error('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{ borderColor: '#bbf7d0', borderTopColor: '#16a34a' }} />
          <p className="text-sm" style={{ color: '#6b7280' }}>Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Produk', value: stats?.totalProduk ?? 0,
      icon: Package, iconBg: 'linear-gradient(135deg,#166534,#16a34a)',
      bgColor: '#f0fdf4', borderColor: '#bbf7d0', valueColor: '#14532d',
      desc: 'Produk aktif tersedia', glowColor: 'rgba(22,163,74,0.15)',
    },
    {
      label: 'Total Kategori', value: stats?.totalKategori ?? 0,
      icon: Tag, iconBg: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
      bgColor: '#eff6ff', borderColor: '#bfdbfe', valueColor: '#1e40af',
      desc: 'Kategori produk', glowColor: 'rgba(59,130,246,0.12)',
    },
    {
      label: 'Stok Menipis', value: stats?.stokMenipis ?? 0,
      icon: AlertTriangle, iconBg: 'linear-gradient(135deg,#dc2626,#ef4444)',
      bgColor: '#fef2f2', borderColor: '#fecaca', valueColor: '#dc2626',
      desc: 'Produk < 10 unit', alert: true, glowColor: 'rgba(220,38,38,0.12)',
    },
  ];

  return (
    <div className="space-y-0 animate-fade-in" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── TICKER BAR ───────────────────────────────────── */}
      <div
        className="overflow-hidden py-2.5 mb-6 rounded-xl"
        style={{ background: '#16a34a' }}
      >
        <div className="ticker-track flex gap-8 whitespace-nowrap" style={{ animation: 'tickerScroll 22s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-xs font-bold tracking-widest text-white opacity-90">{item}</span>
          ))}
        </div>
      </div>

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <div className="relative mb-8 rounded-2xl overflow-hidden" style={{ background: '#f8faf8', border: '1px solid #e5f0e8' }}>
        <div className="px-8 py-6">
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/app/produk"
              id="hero-produk-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg,#166534,#16a34a)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
              }}
            >
              <ShoppingCart size={16} /> Kelola Produk
            </Link>
            <Link
              to="/app/transaksi"
              id="hero-transaksi-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: '#fff',
                color: '#374151',
                border: '1.5px solid #d1d5db',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <TrendingUp size={16} /> Lihat Laporan <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {statCards.map(({ label, value, icon: Icon, iconBg, bgColor, borderColor, valueColor, desc, alert, glowColor }) => (
          <div
            key={label}
            className="stat-card group"
            style={{ background: bgColor, borderColor, boxShadow: `0 4px 16px ${glowColor}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#6b7280' }}>{label}</p>
                <p className="text-5xl font-black leading-none mb-1" style={{ color: valueColor }}>{value}</p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>{desc}</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: iconBg }}
              >
                <Icon size={24} className="text-white" />
              </div>
            </div>
            {alert && value > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #fecaca' }}>
                <Link
                  to="/app/produk"
                  className="text-xs font-semibold flex items-center gap-1 transition-all hover:gap-2"
                  style={{ color: '#dc2626' }}
                >
                  Lihat produk stok menipis <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── STATUS BAR ───────────────────────────────────── */}
      <div
        className="card p-5 flex flex-wrap items-center gap-6 mb-6"
        style={{ background: 'linear-gradient(135deg,#14532d 0%,#15803d 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Sistem Status</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm font-semibold text-white">Aktif & Berjalan</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ShoppingCart size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Produk Tersedia</p>
            <p className="text-sm font-semibold text-white">
              {(stats?.totalProduk ?? 0) - (stats?.stokMenipis ?? 0)} dari {stats?.totalProduk ?? 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Kategori Aktif</p>
            <p className="text-sm font-semibold text-white">{stats?.totalKategori ?? 0} Kategori</p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button
            onClick={fetchStats}
            id="refresh-dashboard-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            to="/app/produk"
            id="view-all-produk-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: '#fff', color: '#15803d' }}
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── RECENT PRODUCTS TABLE ────────────────────────── */}
      <div className="card overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #e5f0e8', background: '#fafffe' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#166534,#16a34a)' }}>
              <Star size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#14532d' }}>Produk Terbaru</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>8 produk yang baru ditambahkan</p>
            </div>
          </div>
          <Link
            to="/app/produk"
            id="see-all-recent-btn"
            className="flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
            style={{ color: '#16a34a' }}
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Ditambahkan</th>
              </tr>
            </thead>
            <tbody>
              {stats?.produkTerbaru?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package size={40} className="mx-auto mb-3" style={{ color: '#d1d5db' }} />
                    <p style={{ color: '#9ca3af' }}>Belum ada produk</p>
                  </td>
                </tr>
              ) : (
                stats?.produkTerbaru?.map((p, i) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs" style={{ color: '#9ca3af' }}>{i + 1}</td>
                    <td className="font-semibold" style={{ color: '#111827' }}>{p.nama_produk}</td>
                    <td><span className="badge-blue">{p.kategori?.nama_kategori}</span></td>
                    <td className="font-mono font-semibold text-sm" style={{ color: '#16a34a' }}>{formatRupiah(p.harga)}</td>
                    <td>
                      {p.stok < 10 ? (
                        <span className="badge-red flex items-center gap-1 w-fit">
                          <AlertTriangle size={9} /> {p.stok}
                        </span>
                      ) : p.stok < 30 ? (
                        <span className="badge-amber">{p.stok}</span>
                      ) : (
                        <span className="badge-green">{p.stok}</span>
                      )}
                    </td>
                    <td className="text-xs" style={{ color: '#9ca3af' }}>{formatDate(p.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { display: flex; }
      `}</style>
    </div>
  );
}
