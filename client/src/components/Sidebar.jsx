import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Tag, ArrowLeftRight,
  Users, X, ShoppingCart, Shield, UserCircle, LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/app/produk',    label: 'Produk',              icon: Package },
  { to: '/app/kategori',  label: 'Kategori',            icon: Tag },
  { to: '/app/transaksi', label: 'Laporan Transaksi',   icon: ArrowLeftRight },
];

const adminNavItems = [
  { to: '/app/users', label: 'Manajemen User', icon: Users },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg, #14532d 0%, #166534 40%, #15803d 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-20 left-0 w-24 h-24 rounded-full opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)', transform: 'translate(-40%, 0)' }} />

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 relative"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Stockmart</h1>
              <p className="text-xs" style={{ color: '#86efac' }}>Manajemen Stok</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: '#86efac' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              {user?.nama?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.nama}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {user?.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(167,139,250,0.25)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)' }}>
                    <Shield size={9} /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(147,197,253,0.2)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.25)' }}>
                    Staff
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-3"
            style={{ color: 'rgba(134,239,172,0.6)' }}>
            Menu Utama
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest px-2 mt-5 mb-3"
                style={{ color: 'rgba(134,239,172,0.6)' }}>
                Administrasi
              </p>
              {adminNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              color: '#fca5a5',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
              e.currentTarget.style.color = '#fca5a5';
            }}
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
