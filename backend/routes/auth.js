const express = require('express');
const {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe,
    updateDetails,
    updatePassword,
    logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);

module.exports = router; 