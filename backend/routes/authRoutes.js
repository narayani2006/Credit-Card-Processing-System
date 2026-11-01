const express = require('express');
const router = express.Router();
const { login, signup, getMe, updateSecuritySettings } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', protect, getMe);
router.put('/security-settings', protect, updateSecuritySettings);

module.exports = router;
