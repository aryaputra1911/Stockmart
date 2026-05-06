import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown, Filter } from 'lucide-react';

const formatDate = (d) =>
  new Date(d).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function Transaksi() {
  const [transaksi, setTransaksi]     = useState([]);
  const [produkList, setProdukList]   = useState([]);
  const [search, setSearch]           = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [loading, setLoading]         = useState(true);

  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState({ produk_id: '', jenis: 'masuk', jumlah: '', keterangan: '' });
  const [formLoading, setFormLoading] = useState(false);

  const fetchTransaksi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/transaksi', {
        params: { search, jenis: filterJenis },
      });
      setTransaksi(res.data);
    } catch {
      toast.error('Gagal memuat data transaksi.');
    } finally {
      setLoading(false);
    }
  }, [search, filterJenis]);

  const fetchProduk = async () => {
    try {
      const res = await api.get('/produk');
      setProdukList(res.data);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchTransaksi(); }, [fetchTransaksi]);
  useEffect(() => { fetchProduk(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.produk_id || !form.jenis || !form.jumlah) {
      toast.error('Produk, jenis, dan jumlah wajib diisi.');
      return;
    }
    setFormLoading(true);
    try {
      await api.post('/transaksi', form);
      toast.success('Transaksi berhasil dicatat!');
      setModalOpen(false);
      setForm({ produk_id: '', jenis: 'masuk', jumlah: '', keterangan: '' });
      fetchTransaksi();
      fetchProduk();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mencatat transaksi.');
    } finally {
      setFormLoading(false);
    }
  };

  const totalMasuk  = transaksi.filter((t) => t.jenis === 'masuk').reduce((a, t) => a + t.jumlah, 0);
  const totalKeluar = transaksi.filter((t) => t.jenis === 'keluar').reduce((a, t) => a + t.jumlah, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#16a34a' }}>
            Laporan
          </p>
          <h1 className="page-title">Laporan Transaksi</h1>
          <p className="page-subtitle">Riwayat transaksi stok — produk · kategori · user</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary" id="add-transaksi-btn">
          <Plus size={17} /> Catat Transaksi
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Transaksi */}
        <div className="card p-5 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #334155, #475569)' }}
          >
            <ArrowLeftRight size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Total Transaksi</p>
            <p className="text-3xl font-black" style={{ color: '#111827' }}>{transaksi.length}</p>
          </div>
        </div>

        {/* Stok Masuk */}
        <div className="card p-5 flex items-center gap-4" style={{ borderColor: '#bbf7d0' }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}
          >
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Total Stok Masuk</p>
            <p className="text-3xl font-black" style={{ color: '#16a34a' }}>{totalMasuk}</p>
          </div>
        </div>

        {/* Stok Keluar */}
        <div className="card p-5 flex items-center gap-4" style={{ borderColor: '#fecaca' }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}
          >
            <TrendingDown size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>Total Stok Keluar</p>
            <p className="text-3xl font-black" style={{ color: '#dc2626' }}>{totalKeluar}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: '#9ca3af' }} />
          <span className="text-sm font-medium" style={{ color: '#6b7280' }}>Filter:</span>
          <div className="tab-group">
            {[
              { val: '', label: 'Semua' },
              { val: 'masuk', label: 'Masuk' },
              { val: 'keluar', label: 'Keluar' },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setFilterJenis(val)}
                className={`tab-btn ${filterJenis === val ? 'active' : ''}`}
                id={`filter-jenis-${val || 'all'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1" />
        <SearchBar value={search} onChange={setSearch} placeholder="Cari produk, user, keterangan..." />
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
                  <th>Tanggal</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Jenis</th>
                  <th>Jumlah</th>
                  <th>Keterangan</th>
                  <th>Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: '#f0fdf4' }}>
                          <ArrowLeftRight size={28} style={{ color: '#86efac' }} />
                        </div>
                        <p className="font-medium" style={{ color: '#6b7280' }}>
                          {search || filterJenis ? 'Tidak ada transaksi yang sesuai filter' : 'Belum ada transaksi'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transaksi.map((t, i) => (
                    <tr key={t.id}>
                      <td className="font-mono text-xs" style={{ color: '#9ca3af' }}>{i + 1}</td>
                      <td className="text-xs whitespace-nowrap" style={{ color: '#6b7280' }}>{formatDate(t.created_at)}</td>
                      <td className="font-semibold whitespace-nowrap" style={{ color: '#111827' }}>{t.nama_produk}</td>
                      <td>
                        <span className="badge-blue">{t.nama_kategori}</span>
                      </td>
                      <td>
                        {t.jenis === 'masuk' ? (
                          <span className="badge-green flex items-center gap-1 w-fit">
                            <TrendingUp size={9} /> Masuk
                          </span>
                        ) : (
                          <span className="badge-red flex items-center gap-1 w-fit">
                            <TrendingDown size={9} /> Keluar
                          </span>
                        )}
                      </td>
                      <td className="font-mono font-bold" style={{ color: '#111827' }}>{t.jumlah}</td>
                      <td className="text-sm max-w-xs truncate" style={{ color: '#6b7280' }}>{t.keterangan || '—'}</td>
                      <td>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#111827' }}>{t.user_nama}</p>
                          <p className="text-xs capitalize" style={{ color: t.user_role === 'admin' ? '#7c3aed' : '#2563eb' }}>
                            {t.user_role}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {transaksi.length > 0 && (
          <div className="px-6 py-3 text-xs" style={{ borderTop: '1px solid #e5f0e8', color: '#9ca3af', background: '#fafffe' }}>
            Menampilkan <strong style={{ color: '#15803d' }}>{transaksi.length}</strong> transaksi
          </div>
        )}
      </div>

      {/* Tambah Transaksi Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Catat Transaksi Stok">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Produk</label>
            <select
              value={form.produk_id}
              onChange={(e) => setForm({ ...form, produk_id: e.target.value })}
              className="input-field"
              id="form-produk-transaksi"
            >
              <option value="">-- Pilih Produk --</option>
              {produkList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_produk} (Stok: {p.stok})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Jenis</label>
              <select
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="input-field"
                id="form-jenis-transaksi"
              >
                <option value="masuk">Stok Masuk</option>
                <option value="keluar">Stok Keluar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>Jumlah</label>
              <input
                type="number"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="input-field"
                placeholder="10"
                min="1"
                id="form-jumlah-transaksi"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>
              Keterangan <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opsional)</span>
            </label>
            <textarea
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="input-field resize-none"
              placeholder="Contoh: Restock dari supplier, Penjualan harian..."
              rows={2}
              id="form-keterangan-transaksi"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center" disabled={formLoading}>Batal</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={formLoading} id="submit-transaksi-btn">
              {formLoading ? 'Menyimpan...' : 'Catat Transaksi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
