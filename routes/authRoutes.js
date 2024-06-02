const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.put('/updateUser', authController.updateUser);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;
