const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

/* ── In-memory reset code store ── */
const resetCodes = new Map(); // email -> { code, expiry }

/* ── Nodemailer transporter ── */
const createTransporter = () => nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ── Email HTML template ── */
const buildResetEmailHtml = (code, nama) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f1f5f1;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f1;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(22,163,74,0.12);">
        <tr>
          <td style="background:linear-gradient(135deg,#14532d,#16a34a);padding:32px 40px;text-align:center;">
            <span style="color:#fff;font-size:1.6rem;font-weight:800;letter-spacing:-0.02em;">🛒 Stockmart</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:0.85rem;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.08em;">Reset Password</p>
            <h2 style="margin:0 0 16px;font-size:1.5rem;font-weight:800;color:#14532d;">Halo, ${nama}! 👋</h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:0.95rem;line-height:1.65;">
              Kami menerima permintaan reset password untuk akun Stockmart Anda.<br>
              Gunakan kode berikut untuk melanjutkan:
            </p>
            <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:0.78rem;color:#9ca3af;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Kode Reset Anda</p>
              <p style="margin:0;font-size:2.8rem;font-weight:900;color:#14532d;letter-spacing:0.35em;font-family:monospace;">${code}</p>
              <p style="margin:8px 0 0;font-size:0.78rem;color:#ef4444;font-weight:600;">⏰ Berlaku selama 15 menit</p>
            </div>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:0.82rem;line-height:1.6;">
              Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0fdf4;text-align:center;">
            <p style="margin:0;font-size:0.75rem;color:#d1d5db;">© 2026 Stockmart &mdash; Sistem Manajemen Stok Supermarket</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/* ─────────────────────────── LOGIN ─────────────────────────── */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });

    const user = await prisma.user.findFirst({ where: { email, deleted_at: null } });
    if (!user)
      return res.status(401).json({ error: 'Email atau password salah.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Email atau password salah.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

/* ─────────────────────────── REGISTER ─────────────────────────── */
const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password)
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password minimal 8 karakter.' });

    const allowedRoles = ['staff', 'admin'];
    const selectedRole = allowedRoles.includes(role) ? role : 'staff';

    const existing = await prisma.user.findFirst({ where: { email, deleted_at: null } });
    if (existing)
      return res.status(409).json({ error: 'Email sudah terdaftar. Gunakan email lain.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: { nama, email, password: hashedPassword, role: selectedRole },
    });

    res.status(201).json({
      message: 'Akun berhasil dibuat.',
      user: { id: newUser.id, nama: newUser.nama, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

/* ─────────────────────────── RESET PASSWORD: REQUEST ─────────────────────────── */
const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email wajib diisi.' });

    const user = await prisma.user.findFirst({ where: { email, deleted_at: null } });
    if (!user)
      return res.status(404).json({ error: 'Email tidak terdaftar dalam sistem.' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 15 * 60 * 1000; // 15 menit
    resetCodes.set(email, { code, expiry });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`\n🔑 [DEV RESET CODE] Email: ${email} | Kode: ${code}\n`);
      return res.json({ message: 'Kode reset dikirim (mode dev: lihat console server).' });
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Stockmart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔑 Kode Reset Password Stockmart',
      html: buildResetEmailHtml(code, user.nama),
    });

    res.json({ message: 'Kode reset berhasil dikirim ke email Anda.' });
  } catch (err) {
    console.error('Reset request error:', err);
    res.status(500).json({ error: 'Gagal mengirim email. Periksa konfigurasi EMAIL_USER dan EMAIL_PASS di .env' });
  }
};

/* ─────────────────────────── RESET PASSWORD: CONFIRM ─────────────────────────── */
const confirmResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.status(400).json({ error: 'Email, kode, dan password baru wajib diisi.' });
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'Password minimal 8 karakter.' });

    const entry = resetCodes.get(email);
    if (!entry)
      return res.status(400).json({ error: 'Kode tidak ditemukan. Minta kode baru.' });
    if (Date.now() > entry.expiry) {
      resetCodes.delete(email);
      return res.status(400).json({ error: 'Kode sudah kadaluarsa. Minta kode baru.' });
    }
    if (entry.code !== code)
      return res.status(400).json({ error: 'Kode tidak valid.' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.updateMany({
      where: { email, deleted_at: null },
      data: { password: hashedPassword },
    });

    resetCodes.delete(email);
    res.json({ message: 'Password berhasil direset.' });
  } catch (err) {
    console.error('Reset confirm error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

module.exports = { login, register, requestResetPassword, confirmResetPassword };
