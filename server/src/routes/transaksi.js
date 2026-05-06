const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getTransaksi, getTransaksiById, createTransaksi } = require('../controllers/transaksiController');

const router = express.Router();

router.get('/', verifyToken, getTransaksi);
router.get('/:id', verifyToken, getTransaksiById);
router.post('/', verifyToken, createTransaksi);

module.exports = router;
