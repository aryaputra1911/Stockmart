const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
  getUsers, createUser, updateUser,
  softDeleteUser, hardDeleteUser, restoreUser,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', verifyToken, requireAdmin, getUsers);
router.post('/', verifyToken, requireAdmin, createUser);
router.put('/:id', verifyToken, requireAdmin, updateUser);
router.delete('/:id/soft', verifyToken, requireAdmin, softDeleteUser);
router.delete('/:id/hard', verifyToken, requireAdmin, hardDeleteUser);
router.post('/:id/restore', verifyToken, requireAdmin, restoreUser);

module.exports = router;
