import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import {
  Plus, Pencil, Trash2, ArchiveRestore, Skull, Package, AlertTriangle, Archive,
} from 'lucide-react';

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

const EMPTY_FORM = { nama_produk: '', harga: '', stok: '', kategori_id: '' };

export default function Produk() {
  const { isAdmin } = useAuth();
  const [produk, setProduk]           = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState('active');

  const [modalOpen, setModalOpen]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [confirm, setConfirm] = useState({ open: false, type: '', id: null, loading: false });

  const fetchProduk = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/produk', {
        params: { search, showDeleted: tab === 'arsip' ? 'true' : 'false' },
      });
      setProduk(res.data);
    } catch {
      toast.error('Gagal memuat data produk.');
    } finally {
      setLoading(false);
    }
  }, [search, tab]);

  const fetchKategori = async () => {
    try {
      const res = await api.get('/kategori');
      setKategoriList(res.data);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchProduk(); }, [fetchProduk]);
  useEffect(() => { fetchKategori(); }, []);

  const openAddModal = () => {
    setEditData(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditData(p);
    setForm({
      nama_produk: p.nama_produk,
      harga: String(p.harga),
      stok: String(p.stok),
      kategori_id: String(p.kategori_id),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_produk || !form.harga || form.stok === '' || !form.kategori_id) {
      toast.error('Semua field wajib diisi.');
      return;
    }
    setFormLoading(true);
    try {
      if (editData) {
        await api.put(`/produk/${editData.id}`, form);
        toast.success('Produk berhasil diperbarui.');
      } else {
        await api.post('/produk', form);
        toast.success('Produk berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchProduk();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan produk.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/produk/${confirm.id}/soft`);
      toast.success('Produk dipindahkan ke arsip.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchProduk();
    } catch {
      toast.error('Gagal mengarsipkan produk.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleHardDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await api.delete(`/produk/${confirm.id}/hard`);
      toast.success('Produk dihapus permanen.');
      setConfirm({ open: false, type: '', id: null, loading: false });
      fetchProduk();
    } catch {
      toast.error('Gagal menghapus produk.');
      setConfirm((c) => ({ ...c, loading: false }));
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.post(`/produk/${id}/restore`);
      toast.success('Produk berhasil dipulihkan.');
      fetchProduk();
    } catch {
      toast.error('Gagal memulihkan produk.');
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
          <h1 className="page-title">Manajemen Produk</h1>
          <p className="page-subtitle">Kelola semua produk supermarket</p>
        </div>
        {isAdmin() && tab === 'active' && (
          <button onClick={openAddModal} className="btn-primary" id="add-produk-btn">
            <Plus size={17} /> Tambah Produk
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="tab-group">
          <button
            onClick={() => setTab('active')}
            className={`tab-btn ${tab === 'active' ? 'active' : ''}`}
            id="tab-active-produk"
          >
            <Package size={14} /> Aktif
          </button>
          {isAdmin() && (
            <button
              onClick={() => setTab('arsip')}
              className={`tab-btn ${tab === 'arsip' ? 'active' : ''}`}
              id="tab-arsip-produk"
            >
              <Archive size={14} /> Arsip
            </button>
          )}
        </div>
        <div className="flex-1" />
        <SearchBar value={search} onChange={setSearch} placeholder="Cari nama produk..." />
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
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  {tab === 'active' ? <th>Status</th> : <th>Diarsipkan</th>}
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: '#f0fdf4' }}>
                          <Package size={28} style={{ color: '#86efac' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#6b7280' }}>
                          {search ? `Tidak ada produk "${search}"` : 'Belum ada produk'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  produk.map((p, i) => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs" style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td className="font-semibold" style={{ color: '#111827' }}>{p.nama_produk}</td>
                      <td>
                        <span className="badge-blue">{p.kategori?.nama_kategori}</span>
                      </td>
                      <td className="font-mono font-semibold text-sm" style={{ color: '#16a34a' }}>
                        {formatRupiah(p.harga)}
                      </td>
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
                      {tab === 'active' ? (
                        <td><span className="badge-green">Aktif</span></td>
                      ) : (
                        <td className="text-xs" style={{ color: '#9ca3af' }}>
                          {new Date(p.deleted_at).toLocaleDateString('id-ID')}
                        </td>
                      )}
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {tab === 'active' ? (
                            <>
                              <button
                                onClick={() => openEditModal(p)}
                                className="btn-warning"
                                id={`edit-produk-${p.id}`}
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              {isAdmin() && (
                                <button
                                  onClick={() => setConfirm({ open: true, type: 'soft', id: p.id, loading: false })}
                                  className="btn-danger"
                                  id={`soft-delete-produk-${p.id}`}
                                >
                                  <Trash2 size={12} /> Arsip
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(p.id)}
                                className="btn-success"
                                id={`restore-produk-${p.id}`}
                              >
                                <ArchiveRestore size={12} /> Pulihkan
                              </button>
                              <button
                                onClick={() => setConfirm({ open: true, type: 'hard', id: p.id, loading: false })}
                                className="btn-danger"
                                id={`hard-delete-produk-${p.id}`}
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
        {produk.length > 0 && (
          <div className="px-6 py-3 text-xs" style={{ borderTop: '1px solid #e5f0e8', color: '#9ca3af', background: '#fafffe' }}>
            Menampilkan <strong style={{ color: '#15803d' }}>{produk.length}</strong> produk
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Produk' : 'Tambah Produk Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Produk</label>
            <input
              type="text"
              value={form.nama_produk}
              onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
              className="input-field"
              placeholder="Contoh: Aqua 600ml"
              id="form-nama-produk"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Harga (Rp)</label>
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="input-field"
                placeholder="3500"
                min="0"
                id="form-harga-produk"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Stok</label>
              <input
                type="number"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
                className="input-field"
                placeholder="100"
                min="0"
                id="form-stok-produk"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Kategori</label>
            <select
              value={form.kategori_id}
              onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
              className="input-field"
              id="form-kategori-produk"
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center" disabled={formLoading}>
              Batal
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={formLoading} id="submit-produk-btn">
              {formLoading ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah Produk')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, type: '', id: null, loading: false })}
        onConfirm={confirm.type === 'soft' ? handleSoftDelete : handleHardDelete}
        loading={confirm.loading}
        title={confirm.type === 'soft' ? 'Arsipkan Produk?' : 'Hapus Permanen?'}
        message={
          confirm.type === 'soft'
            ? 'Produk akan dipindahkan ke arsip dan tidak tampil di daftar utama.'
            : 'Produk akan dihapus permanen dari database. Tindakan ini tidak bisa dibatalkan!'
        }
        confirmText={confirm.type === 'soft' ? 'Arsipkan' : 'Hapus Permanen'}
      />
    </div>
  );
}
