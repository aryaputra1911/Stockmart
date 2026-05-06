const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/produk
const getProduk = async (req, res) => {
  try {
    const { search = '', showDeleted = 'false', lowStock = 'false' } = req.query;
    const isDeleted = showDeleted === 'true';

    const whereClause = {
      deleted_at: isDeleted ? { not: null } : null,
      nama_produk: { contains: search, mode: 'insensitive' },
    };

    if (lowStock === 'true') {
      whereClause.stok = { lt: 10 };
    }

    const produk = await prisma.produk.findMany({
      where: whereClause,
      include: {
        kategori: { select: { id: true, nama_kategori: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(produk);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data produk.' });
  }
};

// GET /api/produk/:id
const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await prisma.produk.findFirst({
      where: { id: parseInt(id) },
      include: { kategori: true },
    });
    if (!produk) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil produk.' });
  }
};

// POST /api/produk
const createProduk = async (req, res) => {
  try {
    const { nama_produk, harga, stok, kategori_id } = req.body;

    if (!nama_produk || !harga || stok === undefined || !kategori_id) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }

    const produk = await prisma.produk.create({
      data: {
        nama_produk,
        harga: parseFloat(harga),
        stok: parseInt(stok),
        kategori_id: parseInt(kategori_id),
      },
      include: { kategori: { select: { id: true, nama_kategori: true } } },
    });

    res.status(201).json({ message: 'Produk berhasil dibuat.', produk });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat produk.' });
  }
};

// PUT /api/produk/:id
const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga, stok, kategori_id } = req.body;

    const existing = await prisma.produk.findFirst({ where: { id: parseInt(id), deleted_at: null } });
    if (!existing) return res.status(404).json({ error: 'Produk tidak ditemukan.' });

    const updateData = {};
    if (nama_produk !== undefined) updateData.nama_produk = nama_produk;
    if (harga !== undefined) updateData.harga = parseFloat(harga);
    if (stok !== undefined) updateData.stok = parseInt(stok);
    if (kategori_id !== undefined) updateData.kategori_id = parseInt(kategori_id);

    const updated = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { kategori: { select: { id: true, nama_kategori: true } } },
    });

    res.json({ message: 'Produk berhasil diperbarui.', produk: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
};

// DELETE /api/produk/:id/soft
const softDeleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produk.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    res.json({ message: 'Produk berhasil diarsipkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengarsipkan produk.' });
  }
};

// DELETE /api/produk/:id/hard
const hardDeleteProduk = async (req, res) => {
  try {
    const { id } = req.params;
    // Hapus transaksi terkait dulu
    await prisma.transaksiStok.deleteMany({ where: { produk_id: parseInt(id) } });
    await prisma.produk.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Produk berhasil dihapus permanen.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
};

// POST /api/produk/:id/restore
const restoreProduk = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produk.update({
      where: { id: parseInt(id) },
      data: { deleted_at: null },
    });
    res.json({ message: 'Produk berhasil dipulihkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memulihkan produk.' });
  }
};

// GET /api/produk/stats — Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalProduk, totalKategori, stokMenipis, produkTerbaru] = await Promise.all([
      prisma.produk.count({ where: { deleted_at: null } }),
      prisma.kategori.count({ where: { deleted_at: null } }),
      prisma.produk.count({ where: { deleted_at: null, stok: { lt: 10 } } }),
      prisma.produk.findMany({
        where: { deleted_at: null },
        include: { kategori: { select: { nama_kategori: true } } },
        orderBy: { created_at: 'desc' },
        take: 8,
      }),
    ]);

    res.json({ totalProduk, totalKategori, stokMenipis, produkTerbaru });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil statistik dashboard.' });
  }
};

module.exports = {
  getProduk, getProdukById, createProduk, updateProduk,
  softDeleteProduk, hardDeleteProduk, restoreProduk, getDashboardStats,
};
