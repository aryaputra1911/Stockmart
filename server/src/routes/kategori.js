const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  getKategori, getKategoriById, createKategori, updateKategori,
  softDeleteKategori, hardDeleteKategori, restoreKategori,
} = require('../controllers/kategoriController');

const router = express.Router();

router.get('/', verifyToken, getKategori);
router.get('/:id', verifyToken, getKategoriById);
router.post('/', verifyToken, requireAdmin, createKategori);
router.put('/:id', verifyToken, requireAdmin, updateKategori);
router.delete('/:id/soft', verifyToken, requireAdmin, softDeleteKategori);
router.delete('/:id/hard', verifyToken, requireAdmin, hardDeleteKategori);
router.post('/:id/restore', verifyToken, requireAdmin, restoreKategori);

module.exports = router;
