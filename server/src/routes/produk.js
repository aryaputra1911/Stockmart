const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  getProduk, getProdukById, createProduk, updateProduk,
  softDeleteProduk, hardDeleteProduk, restoreProduk, getDashboardStats,
} = require('../controllers/produkController');

const router = express.Router();

router.get('/stats', verifyToken, getDashboardStats);
router.get('/', verifyToken, getProduk);
router.get('/:id', verifyToken, getProdukById);
router.post('/', verifyToken, requireAdmin, createProduk);
router.put('/:id', verifyToken, updateProduk); // Staff bisa update stok
router.delete('/:id/soft', verifyToken, requireAdmin, softDeleteProduk);
router.delete('/:id/hard', verifyToken, requireAdmin, hardDeleteProduk);
router.post('/:id/restore', verifyToken, requireAdmin, restoreProduk);

module.exports = router;
