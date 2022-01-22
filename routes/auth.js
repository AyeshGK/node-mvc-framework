const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.handleNewUser);
router.post('/login', authController.handleLogin);
router.get('/refresh-token', authController.handleRefreshToken);
router.get('/logout', authController.handleLogout);

module.exports = router