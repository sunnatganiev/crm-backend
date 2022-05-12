const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router
  .route('/reset-password')
  .post(authController.forgotPassword)
  .patch(authController.resetPassword);

router
  .route('/')
  .get(authController.protect, userController.getUser)
  .post(authController.createUser);

router.post('/login', authController.login);

module.exports = router;
