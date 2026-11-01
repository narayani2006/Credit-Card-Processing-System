const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', protect, adminOnly, getUsers);
router.put('/:id/status', protect, adminOnly, toggleUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
