const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/', authController.createUser);
router.post('/login', authController.login);

module.exports = router;
