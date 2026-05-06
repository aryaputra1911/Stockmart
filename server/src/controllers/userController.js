const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// GET /api/users — List all users (admin only)
const getUsers = async (req, res) => {
  try {
    const { search = '', showDeleted = 'false' } = req.query;
    const whereClause = {
      deleted_at: showDeleted === 'true' ? { not: null } : null,
      OR: [
        { nama: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true, nama: true, email: true, role: true, created_at: true, deleted_at: true,
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data user.' });
  }
};

// POST /api/users — Tambah user baru
const createUser = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nama, email, password: hashedPassword, role: role || 'staff' },
      select: { id: true, nama: true, email: true, role: true, created_at: true },
    });

    res.status(201).json({ message: 'User berhasil dibuat.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat user.' });
  }
};

// PUT /api/users/:id — Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, password, role } = req.body;

    const user = await prisma.user.findFirst({ where: { id: parseInt(id), deleted_at: null } });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    const updateData = { nama, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, nama: true, email: true, role: true, created_at: true },
    });

    res.json({ message: 'User berhasil diperbarui.', user: updated });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email sudah digunakan.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui user.' });
  }
};

// DELETE /api/users/:id/soft — Soft delete
const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Tidak bisa menghapus akun sendiri.' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
    });

    res.json({ message: 'User berhasil diarsipkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengarsipkan user.' });
  }
};

// DELETE /api/users/:id/hard — Hard delete
const hardDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User berhasil dihapus permanen.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus user.' });
  }
};

// POST /api/users/:id/restore — Restore soft-deleted user
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { deleted_at: null },
    });
    res.json({ message: 'User berhasil dipulihkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memulihkan user.' });
  }
};

module.exports = { getUsers, createUser, updateUser, softDeleteUser, hardDeleteUser, restoreUser };
