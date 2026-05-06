import { useLocation } from 'react-router-dom';
import { Menu, Bell, ShoppingCart, LayoutDashboard, Package, Tag, ArrowLeftRight, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const routeMeta = {
  '/app/dashboard': { title: 'Dashboard',            icon: LayoutDashboard },
  '/app/produk':    { title: 'Manajemen Produk',      icon: Package },
  '/app/kategori':  { title: 'Manajemen Kategori',    icon: Tag },
  '/app/transaksi': { title: 'Laporan Transaksi',     icon: ArrowLeftRight },
  '/app/users':     { title: 'Manajemen User',        icon: Users },
};

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const meta = routeMeta[location.pathname] || { title: 'Stockmart', icon: ShoppingCart };
  const PageIcon = meta.icon;

  return (
    <header
      className="h-16 flex items-center px-6 gap-4 sticky top-0 z-30"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5f0e8',
        boxShadow: '0 1px 6px rgba(22, 101, 52, 0.06)',
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: '#6b7280' }}
        onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        id="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}>
          <PageIcon size={15} className="text-white" />
        </div>
        <h2 className="text-base font-700 tracking-tight" style={{ color: '#14532d', fontWeight: 700 }}>
          {meta.title}
        </h2>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Brand (hidden on small) */}
        <div className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-lg"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <ShoppingCart size={14} style={{ color: '#16a34a' }} />
          <span className="text-sm font-semibold" style={{ color: '#15803d' }}>Stockmart</span>
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
        >
          <Bell size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-7 mx-1" style={{ background: '#e5e7eb' }} />

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)', boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
          >
            {user?.nama?.charAt(0)?.toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-none" style={{ color: '#111827' }}>{user?.nama}</p>
            <p className="text-xs mt-0.5 capitalize" style={{ color: '#6b7280' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
