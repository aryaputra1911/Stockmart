const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Users
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockmart.com' },
    update: {},
    create: {
      nama: 'Administrator',
      email: 'admin@stockmart.com',
      password: hashedAdminPassword,
      role: 'admin',
    },
  });

  const staff1 = await prisma.user.upsert({
    where: { email: 'budi@stockmart.com' },
    update: {},
    create: {
      nama: 'Budi Santoso',
      email: 'budi@stockmart.com',
      password: hashedStaffPassword,
      role: 'staff',
    },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'sari@stockmart.com' },
    update: {},
    create: {
      nama: 'Sari Dewi',
      email: 'sari@stockmart.com',
      password: hashedStaffPassword,
      role: 'staff',
    },
  });

  console.log('✅ Users seeded');

  // Seed Kategori
  const kat1 = await prisma.kategori.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nama_kategori: 'Minuman',
      deskripsi: 'Berbagai jenis minuman segar dan kemasan',
    },
  });

  const kat2 = await prisma.kategori.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nama_kategori: 'Makanan Ringan',
      deskripsi: 'Snack dan camilan berbagai merek',
    },
  });

  const kat3 = await prisma.kategori.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nama_kategori: 'Kebutuhan Rumah Tangga',
      deskripsi: 'Produk kebersihan dan kebutuhan sehari-hari',
    },
  });

  const kat4 = await prisma.kategori.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      nama_kategori: 'Sayur & Buah',
      deskripsi: 'Produk segar sayuran dan buah-buahan',
    },
  });

  const kat5 = await prisma.kategori.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      nama_kategori: 'Dairy & Telur',
      deskripsi: 'Produk susu, keju, yogurt, dan telur',
    },
  });

  console.log('✅ Kategori seeded');

  // Seed Produk
  const produkData = [
    { nama_produk: 'Aqua 600ml', harga: 3500, stok: 150, kategori_id: 1 },
    { nama_produk: 'Teh Botol Sosro', harga: 4000, stok: 80, kategori_id: 1 },
    { nama_produk: 'Coca Cola 330ml', harga: 6000, stok: 60, kategori_id: 1 },
    { nama_produk: 'Indomilk UHT 200ml', harga: 5500, stok: 5, kategori_id: 1 },
    { nama_produk: 'Sprite 1.5L', harga: 12000, stok: 45, kategori_id: 1 },
    { nama_produk: 'Chitato Original 68g', harga: 15000, stok: 70, kategori_id: 2 },
    { nama_produk: 'Oreo Original', harga: 8500, stok: 90, kategori_id: 2 },
    { nama_produk: 'Indomie Goreng', harga: 3500, stok: 200, kategori_id: 2 },
    { nama_produk: 'Pocky Coklat', harga: 12000, stok: 8, kategori_id: 2 },
    { nama_produk: 'Rinso Anti Noda 900g', harga: 28000, stok: 40, kategori_id: 3 },
    { nama_produk: 'Sunlight 755ml', harga: 18000, stok: 55, kategori_id: 3 },
    { nama_produk: 'Softex 12pcs', harga: 25000, stok: 6, kategori_id: 3 },
    { nama_produk: 'Tomat 500g', harga: 8000, stok: 30, kategori_id: 4 },
    { nama_produk: 'Bayam 250g', harga: 4000, stok: 3, kategori_id: 4 },
    { nama_produk: 'Pisang Cavendish 1kg', harga: 18000, stok: 25, kategori_id: 4 },
    { nama_produk: 'Susu Ultra 1L', harga: 16500, stok: 35, kategori_id: 5 },
    { nama_produk: 'Telur Ayam 1kg', harga: 27000, stok: 50, kategori_id: 5 },
    { nama_produk: 'Keju Kraft 165g', harga: 22000, stok: 7, kategori_id: 5 },
  ];

  for (const p of produkData) {
    await prisma.produk.create({ data: p });
  }

  console.log('✅ Produk seeded');

  // Seed Transaksi Stok
  const produkList = await prisma.produk.findMany();

  const transaksiData = [
    { produk_id: produkList[0].id, user_id: admin.id, jenis: 'masuk', jumlah: 100, keterangan: 'Stok awal dari supplier' },
    { produk_id: produkList[1].id, user_id: staff1.id, jenis: 'keluar', jumlah: 20, keterangan: 'Penjualan harian' },
    { produk_id: produkList[2].id, user_id: staff1.id, jenis: 'masuk', jumlah: 50, keterangan: 'Restock mingguan' },
    { produk_id: produkList[5].id, user_id: staff2.id, jenis: 'keluar', jumlah: 15, keterangan: 'Penjualan kasir 2' },
    { produk_id: produkList[7].id, user_id: admin.id, jenis: 'masuk', jumlah: 200, keterangan: 'Pembelian dari distributor' },
    { produk_id: produkList[9].id, user_id: staff1.id, jenis: 'keluar', jumlah: 10, keterangan: 'Penjualan' },
    { produk_id: produkList[11].id, user_id: staff2.id, jenis: 'masuk', jumlah: 30, keterangan: 'Restock bulanan' },
    { produk_id: produkList[15].id, user_id: admin.id, jenis: 'keluar', jumlah: 5, keterangan: 'Penjualan promosi' },
    { produk_id: produkList[3].id, user_id: staff1.id, jenis: 'masuk', jumlah: 50, keterangan: 'Restock dari gudang' },
    { produk_id: produkList[16].id, user_id: staff2.id, jenis: 'keluar', jumlah: 30, keterangan: 'Penjualan harian kasir' },
  ];

  for (const t of transaksiData) {
    await prisma.transaksiStok.create({ data: t });
  }

  console.log('✅ Transaksi stok seeded');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('👤 Login credentials:');
  console.log('   Admin: admin@stockmart.com / admin123');
  console.log('   Staff: budi@stockmart.com / staff123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
