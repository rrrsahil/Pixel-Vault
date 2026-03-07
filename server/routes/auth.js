const express = require('express');
const { register, login, getMe, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, requireAuth, getMe);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
