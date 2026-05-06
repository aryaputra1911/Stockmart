import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import { Plus, Pencil, Trash2, ArchiveRestore, Skull, Tag, Archive } from 'lucide-react';

const EMPTY_FORM = { nama_kategori: '', deskripsi: '' };

export default function Kategori() {
  const { isAdmin } = useAuth();
  const [kategori, setKategori]       = useState([]);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('active');

  const [modalOpen, setModalOpen]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [confirm, setConfirm] = useState({ open: false, type: '', id: null, loading: false });

  const fetchKategori = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/kategori', {
        params: { search, showDeleted: tab === 'arsip' ? 'true' : 'false' },
      });
      setKategori(res.data);
    } catch {
      toast.error('Gagal memuat data kategori.');
    } finally {
      setLoading(false);
    }
  }, [search, tab]);

  useEffect(() => { fetchKategori(); }, [fetchKategori]);

  const openAddModal = () => {
    setEditData(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (k) => {
    setEditData(k);
    setForm({ nama_kategori: k.nama_kategori, deskripsi: k.deskripsi || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_kategori) {
      toast.error('Nama kategori wajib diisi.');
      return;
    }
    setFormLoading(true);
    try {
      if (editData) {
        await api.put(`/kategori/${editData.id}`, form);
        toast.success('Kategori berhasil diperbarui.');
      } else {
        await api.post('/kategori', form);
        toast.success('Kategori berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchKategori();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan kategori.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/kategori/${confirm.id}/soft`);
      toast.success('Kategori dipindahkan ke arsip.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchKategori();
    } catch {
      toast.error('Gagal mengarsipkan kategori.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleHardDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/kategori/${confirm.id}/hard`);
      toast.success('Kategori dihapus permanen.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchKategori();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menghapus kategori.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/kategori/${id}/restore`);
      toast.success('Kategori berhasil dipulihkan.');
      fetchKategori();
    } catch {
      toast.error('Gagal memulihkan kategori.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#16a34a' }}>
            Inventori
          </p>
          <h1 className="page-title">Manajemen Kategori</h1>
          <p className="page-subtitle">Kelola kategori produk supermarket</p>
        </div>
        {isAdmin() && tab === 'active' && (
          <button onClick={openAddModal} className="btn-primary" id="add-kategori-btn">
            <Plus size={17} /> Tambah Kategori
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="tab-group">
          <button
            onClick={() => setTab('active')}
            className={`tab-btn ${tab === 'active' ? 'active' : ''}`}
            id="tab-active-kategori"
          >
            <Tag size={14} /> Aktif
          </button>
          {isAdmin() && (
            <button
              onClick={() => setTab('arsip')}
              className={`tab-btn ${tab === 'arsip' ? 'active' : ''}`}
              id="tab-arsip-kategori"
            >
              <Archive size={14} /> Arsip
            </button>
          )}
        </div>
        <div className="flex-1" />
        <SearchBar value={search} onChange={setSearch} placeholder="Cari kategori..." />
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
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Jumlah Produk</th>
                  {tab === 'arsip' && <th>Diarsipkan</th>}
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategori.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: '#f0fdf4' }}>
                          <Tag size={28} style={{ color: '#86efac' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#6b7280' }}>
                          {search ? `Tidak ada kategori "${search}"` : 'Belum ada kategori'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  kategori.map((k, i) => (
                    <tr key={k.id}>
                      <td className="font-mono text-xs" style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}
                          >
                            <Tag size={14} className="text-white" />
                          </div>
                          <span className="font-semibold" style={{ color: '#111827' }}>{k.nama_kategori}</span>
                        </div>
                      </td>
                      <td className="text-sm max-w-xs truncate" style={{ color: '#6b7280' }}>
                        {k.deskripsi || '—'}
                      </td>
                      <td>
                        <span className="badge-blue">{k._count?.produk ?? 0} produk</span>
                      </td>
                      {tab === 'arsip' && (
                        <td className="text-xs" style={{ color: '#9ca3af' }}>
                          {new Date(k.deleted_at).toLocaleDateString('id-ID')}
                        </td>
                      )}
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {tab === 'active' ? (
                            <>
                              {isAdmin() && (
                                <>
                                  <button
                                    onClick={() => openEditModal(k)}
                                    className="btn-warning"
                                    id={`edit-kategori-${k.id}`}
                                  >
                                    <Pencil size={12} /> Edit
                                  </button>
                                  <button
                                    onClick={() => setConfirm({ open: true, type: 'soft', id: k.id, loading: false })}
                                    className="btn-danger"
                                    id={`soft-delete-kategori-${k.id}`}
                                  >
                                    <Trash2 size={12} /> Arsip
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(k.id)}
                                className="btn-success"
                                id={`restore-kategori-${k.id}`}
                              >
                                <ArchiveRestore size={12} /> Pulihkan
                              </button>
                              <button
                                onClick={() => setConfirm({ open: true, type: 'hard', id: k.id, loading: false })}
                                className="btn-danger"
                                id={`hard-delete-kategori-${k.id}`}
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
        {kategori.length > 0 && (
          <div className="px-6 py-3 text-xs" style={{ borderTop: '1px solid #e5f0e8', color: '#9ca3af', background: '#fafffe' }}>
            Menampilkan <strong style={{ color: '#15803d' }}>{kategori.length}</strong> kategori
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Edit Kategori' : 'Tambah Kategori Baru'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Kategori</label>
            <input
              type="text"
              value={form.nama_kategori}
              onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })}
              className="input-field"
              placeholder="Contoh: Minuman"
              id="form-nama-kategori"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              Deskripsi <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opsional)</span>
            </label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="input-field resize-none"
              placeholder="Deskripsi singkat kategori..."
              rows={3}
              id="form-deskripsi-kategori"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center" disabled={formLoading}>Batal</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={formLoading} id="submit-kategori-btn">
              {formLoading ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah Kategori')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, type: '', id: null, loading: false })}
        onConfirm={confirm.type === 'soft' ? handleSoftDelete : handleHardDelete}
        loading={confirm.loading}
        title={confirm.type === 'soft' ? 'Arsipkan Kategori?' : 'Hapus Permanen?'}
        message={confirm.type === 'soft' ? 'Kategori akan dipindahkan ke arsip.' : 'Kategori akan dihapus permanen. Tindakan ini tidak bisa dibatalkan!'}
        confirmText={confirm.type === 'soft' ? 'Arsipkan' : 'Hapus Permanen'}
      />
    </div>
  );
}
