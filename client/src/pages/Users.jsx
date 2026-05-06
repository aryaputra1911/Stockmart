import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import { Plus, Pencil, Trash2, ArchiveRestore, Skull, Users as UsersIcon, Shield, Archive } from 'lucide-react';

const EMPTY_FORM = { nama: '', email: '', password: '', role: 'staff' };

// Generate consistent color per user initial
const avatarColors = [
  'linear-gradient(135deg, #166534, #16a34a)',
  'linear-gradient(135deg, #1d4ed8, #3b82f6)',
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #b45309, #f59e0b)',
  'linear-gradient(135deg, #be185d, #ec4899)',
  'linear-gradient(135deg, #0369a1, #0ea5e9)',
];
const getAvatarColor = (name = '') =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]             = useState([]);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('active');

  const [modalOpen, setModalOpen]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [confirm, setConfirm] = useState({ open: false, type: '', id: null, loading: false });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { search, showDeleted: tab === 'arsip' ? 'true' : 'false' },
      });
      setUsers(res.data);
    } catch {
      toast.error('Gagal memuat data user.');
    } finally {
      setLoading(false);
    }
  }, [search, tab]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAddModal = () => {
    setEditData(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditData(u);
    setForm({ nama: u.nama, email: u.email, password: '', role: u.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.email || (!editData && !form.password)) {
      toast.error(editData ? 'Nama dan email wajib diisi.' : 'Semua field wajib diisi.');
      return;
    }
    setFormLoading(true);
    try {
      if (editData) {
        await api.put(`/users/${editData.id}`, form);
        toast.success('User berhasil diperbarui.');
      } else {
        await api.post('/users', form);
        toast.success('User berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan user.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/users/${confirm.id}/soft`);
      toast.success('User dipindahkan ke arsip.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mengarsipkan user.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleHardDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/users/${confirm.id}/hard`);
      toast.success('User dihapus permanen.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menghapus user.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/users/${id}/restore`);
      toast.success('User berhasil dipulihkan.');
      fetchUsers();
    } catch {
      toast.error('Gagal memulihkan user.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#16a34a' }}>
            Administrasi
          </p>
          <h1 className="page-title">Manajemen User</h1>
          <p className="page-subtitle">Kelola akun pengguna sistem Stockmart</p>
        </div>
        {tab === 'active' && (
          <button onClick={openAddModal} className="btn-primary" id="add-user-btn">
            <Plus size={17} /> Tambah User
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="tab-group">
          <button
            onClick={() => setTab('active')}
            className={`tab-btn ${tab === 'active' ? 'active' : ''}`}
            id="tab-active-users"
          >
            <UsersIcon size={14} /> Aktif
          </button>
          <button
            onClick={() => setTab('arsip')}
            className={`tab-btn ${tab === 'arsip' ? 'active' : ''}`}
            id="tab-arsip-users"
          >
            <Archive size={14} /> Arsip
          </button>
        </div>
        <div className="flex-1" />
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama atau email..." />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-9 h-9 border-4 rounded-full animate-spin"
                style={{ borderColor: '#bbf7d0', borderTopColor: '#16a34a' }} />
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Bergabung</th>
                  {tab === 'arsip' && <th>Diarsipkan</th>}
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: '#f0fdf4' }}>
                          <UsersIcon size={28} style={{ color: '#86efac' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#6b7280' }}>
                          {search ? `Tidak ada user "${search}"` : 'Belum ada user'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u.id}>
                      <td className="font-mono text-xs" style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: getAvatarColor(u.nama) }}
                          >
                            {u.nama?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: '#111827' }}>{u.nama}</p>
                            {u.id === currentUser?.id && (
                              <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>(Anda)</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm" style={{ color: '#6b7280' }}>{u.email}</td>
                      <td>
                        {u.role === 'admin' ? (
                          <span className="badge-purple flex items-center gap-1 w-fit">
                            <Shield size={9} /> Admin
                          </span>
                        ) : (
                          <span className="badge-blue">Staff</span>
                        )}
                      </td>
                      <td className="text-xs" style={{ color: '#9ca3af' }}>
                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                      {tab === 'arsip' && (
                        <td className="text-xs" style={{ color: '#9ca3af' }}>
                          {new Date(u.deleted_at).toLocaleDateString('id-ID')}
                        </td>
                      )}
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {tab === 'active' ? (
                            <>
                              <button
                                onClick={() => openEditModal(u)}
                                className="btn-warning"
                                id={`edit-user-${u.id}`}
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              {u.id !== currentUser?.id && (
                                <button
                                  onClick={() => setConfirm({ open: true, type: 'soft', id: u.id, loading: false })}
                                  className="btn-danger"
                                  id={`soft-delete-user-${u.id}`}
                                >
                                  <Trash2 size={12} /> Arsip
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(u.id)}
                                className="btn-success"
                                id={`restore-user-${u.id}`}
                              >
                                <ArchiveRestore size={12} /> Pulihkan
                              </button>
                              <button
                                onClick={() => setConfirm({ open: true, type: 'hard', id: u.id, loading: false })}
                                className="btn-danger"
                                id={`hard-delete-user-${u.id}`}
                              >
                                <Skull size={12} /> Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {users.length > 0 && (
          <div className="px-6 py-3 text-xs" style={{ borderTop: '1px solid #e5f0e8', color: '#9ca3af', background: '#fafffe' }}>
            Menampilkan <strong style={{ color: '#15803d' }}>{users.length}</strong> user
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit User' : 'Tambah User Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Lengkap</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="input-field"
              placeholder="Contoh: Budi Santoso"
              id="form-nama-user"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="budi@stockmart.com"
              id="form-email-user"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              Password {editData && <span style={{ color: '#9ca3af', fontWeight: 400 }}>(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder={editData ? '••••••••' : 'Minimal 6 karakter'}
              id="form-password-user"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="input-field"
              id="form-role-user"
            >
              <option value="staff">Staff / Kasir</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center" disabled={formLoading}>Batal</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={formLoading} id="submit-user-btn">
              {formLoading ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah User')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, type: '', id: null, loading: false })}
        onConfirm={confirm.type === 'soft' ? handleSoftDelete : handleHardDelete}
        loading={confirm.loading}
        title={confirm.type === 'soft' ? 'Arsipkan User?' : 'Hapus Permanen?'}
        message={confirm.type === 'soft' ? 'User akan dinonaktifkan dan tidak bisa login.' : 'User akan dihapus permanen dari database!'}
        confirmText={confirm.type === 'soft' ? 'Arsipkan' : 'Hapus Permanen'}
      />
    </div>
  );
}
