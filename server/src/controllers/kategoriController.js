const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/kategori
const getKategori = async (req, res) => {
  try {
    const { search = '', showDeleted = 'false' } = req.query;
    const isDeleted = showDeleted === 'true';

    const kategori = await prisma.kategori.findMany({
      where: {
        deleted_at: isDeleted ? { not: null } : null,
        nama_kategori: { contains: search, mode: 'insensitive' },
      },
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { produk: { where: { deleted_at: null } } } },
      },
    });

    res.json(kategori);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data kategori.' });
  }
};

// GET /api/kategori/:id
const getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await prisma.kategori.findFirst({
      where: { id: parseInt(id) },
    });
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil kategori.' });
  }
};

// POST /api/kategori
const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    if (!nama_kategori) return res.status(400).json({ error: 'Nama kategori wajib diisi.' });

    const kategori = await prisma.kategori.create({
      data: { nama_kategori, deskripsi },
    });

    res.status(201).json({ message: 'Kategori berhasil dibuat.', kategori });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat kategori.' });
  }
};

// PUT /api/kategori/:id
const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori, deskripsi } = req.body;

    const existing = await prisma.kategori.findFirst({ where: { id: parseInt(id), deleted_at: null } });
    if (!existing) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });

    const updated = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { nama_kategori, deskripsi },
    });

    res.json({ message: 'Kategori berhasil diperbarui.', kategori: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui kategori.' });
  }
};

// DELETE /api/kategori/:id/soft
const softDeleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    res.json({ message: 'Kategori berhasil diarsipkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengarsipkan kategori.' });
  }
};

// DELETE /api/kategori/:id/hard
const hardDeleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.kategori.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Kategori berhasil dihapus permanen.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus kategori.' });
  }
};

// POST /api/kategori/:id/restore
const restoreKategori = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { deleted_at: null },
    });
    res.json({ message: 'Kategori berhasil dipulihkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memulihkan kategori.' });
  }
};

module.exports = {
  getKategori, getKategoriById, createKategori, updateKategori,
  softDeleteKategori, hardDeleteKategori, restoreKategori,
};
