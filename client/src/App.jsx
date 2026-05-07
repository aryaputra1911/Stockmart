// Stockmart - Aplikasi manajemen stok
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Produk from './pages/Produk';
import Kategori from './pages/Kategori';
import Transaksi from './pages/Transaksi';
import Users from './pages/Users';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f5f1' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ borderColor: '#bbf7d0', borderTopColor: '#16a34a' }}
          />
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Memuat Stockmart...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/app/dashboard" replace />;

  return children;
};

/* Public route — redirect to dashboard if already logged in */
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/app/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Landing page (splash) ── */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />

          {/* ── Login ── */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* ── Register ── */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* ── Reset Password ── */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ── Protected app routes ── */}
          <Route
            path="/app"
            element={<ProtectedRoute><Layout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="produk"     element={<Produk />} />
            <Route path="kategori"   element={<Kategori />} />
            <Route path="transaksi"  element={<Transaksi />} />
            <Route
              path="users"
              element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>}
            />
          </Route>

          {/* Legacy paths — redirect to /app/... */}
          <Route path="/dashboard"  element={<ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>} />
          <Route path="/produk"     element={<ProtectedRoute><Navigate to="/app/produk" replace /></ProtectedRoute>} />
          <Route path="/kategori"   element={<ProtectedRoute><Navigate to="/app/kategori" replace /></ProtectedRoute>} />
          <Route path="/transaksi"  element={<ProtectedRoute><Navigate to="/app/transaksi" replace /></ProtectedRoute>} />
          <Route path="/users"      element={<ProtectedRoute><Navigate to="/app/users" replace /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
