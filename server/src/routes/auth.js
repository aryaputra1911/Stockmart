const express = require('express');
const {
  login,
  register,
  requestResetPassword,
  verifyResetCode,
  confirmResetPassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password/request', requestResetPassword);
router.post('/reset-password/verify', verifyResetCode); 
router.post('/reset-password/confirm', confirmResetPassword);

module.exports = router;
