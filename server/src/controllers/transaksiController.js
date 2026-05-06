const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Handle BigInt serialization dari PostgreSQL raw query
BigInt.prototype.toJSON = function () { return Number(this); };

// GET /api/transaksi — Raw SQL Query JOIN 4 tabel: transaksi_stok + produk + kategori + users
const getTransaksi = async (req, res) => {
  try {
    const { search = '', jenis = '' } = req.query;

    // Build dynamic WHERE conditions
    const conditions = [];
    const params = [];

    if (jenis === 'masuk' || jenis === 'keluar') {
      params.push(jenis);
      conditions.push(`ts.jenis::text = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(`(
        p.nama_produk ILIKE $${idx}
        OR u.nama ILIKE $${idx}
        OR ts.keterangan ILIKE $${idx}
      )`);
    }

    const whereSQL = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query JOIN 4 tabel:
    // 1. transaksi_stok (tabel utama)
    // 2. produk         (JOIN via produk_id)
    // 3. kategori        (JOIN via produk.kategori_id)
    // 4. users           (JOIN via user_id)
    const transaksi = await prisma.$queryRawUnsafe(`
      SELECT 
        ts.id,
        ts.produk_id,
        ts.user_id,
        ts.jenis::text AS jenis,
        ts.jumlah,
        ts.keterangan,
        ts.created_at,
        p.nama_produk,
        k.id AS kategori_id,
        k.nama_kategori,
        u.nama AS user_nama,
        u.email AS user_email,
        u.role::text AS user_role
      FROM transaksi_stok ts
      JOIN produk p    ON ts.produk_id = p.id
      JOIN kategori k  ON p.kategori_id = k.id
      JOIN users u     ON ts.user_id = u.id
      ${whereSQL}
      ORDER BY ts.created_at DESC
    `, ...params);

    res.json(transaksi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data transaksi.' });
  }
};

// GET /api/transaksi/:id — Raw SQL Query JOIN 4 tabel
const getTransaksiById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.$queryRawUnsafe(`
      SELECT 
        ts.id,
        ts.produk_id,
        ts.user_id,
        ts.jenis::text AS jenis,
        ts.jumlah,
        ts.keterangan,
        ts.created_at,
        p.nama_produk,
        k.id AS kategori_id,
        k.nama_kategori,
        u.nama AS user_nama,
        u.email AS user_email,
        u.role::text AS user_role
      FROM transaksi_stok ts
      JOIN produk p    ON ts.produk_id = p.id
      JOIN kategori k  ON p.kategori_id = k.id
      JOIN users u     ON ts.user_id = u.id
      WHERE ts.id = $1
    `, parseInt(id));
    if (!result.length) return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil transaksi.' });
  }
};

// POST /api/transaksi — Catat transaksi + update stok produk
const createTransaksi = async (req, res) => {
  try {
    const { produk_id, jenis, jumlah, keterangan } = req.body;
    const user_id = req.user.id;

    if (!produk_id || !jenis || !jumlah) {
      return res.status(400).json({ error: 'Produk, jenis, dan jumlah wajib diisi.' });
    }

    const produk = await prisma.produk.findFirst({ where: { id: parseInt(produk_id), deleted_at: null } });
    if (!produk) return res.status(404).json({ error: 'Produk tidak ditemukan.' });

    // Cek stok untuk transaksi keluar
    if (jenis === 'keluar' && produk.stok < parseInt(jumlah)) {
      return res.status(400).json({ error: `Stok tidak mencukupi. Stok tersedia: ${produk.stok}` });
    }

    // Update stok
    const newStok = jenis === 'masuk'
      ? produk.stok + parseInt(jumlah)
      : produk.stok - parseInt(jumlah);

    // Create transaksi + update stok dalam transaction
    const result = await prisma.$transaction([
      prisma.transaksiStok.create({
        data: {
          produk_id: parseInt(produk_id),
          user_id: parseInt(user_id),
          jenis,
          jumlah: parseInt(jumlah),
          keterangan,
        },
        include: {
          produk: { include: { kategori: true } },
          user: { select: { id: true, nama: true, email: true } },
        },
      }),
      prisma.produk.update({
        where: { id: parseInt(produk_id) },
        data: { stok: newStok },
      }),
    ]);

    res.status(201).json({
      message: 'Transaksi berhasil dicatat.',
      transaksi: result[0],
      stokBaru: newStok,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mencatat transaksi.' });
  }
};

module.exports = { getTransaksi, getTransaksiById, createTransaksi };
