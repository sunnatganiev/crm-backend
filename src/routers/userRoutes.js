const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const {
  forgotPassReqValidation,
  resetPassReqValidation,
} = require('../utils/formValidation');

const router = express.Router();

router
  .route('/reset-password')
  .post(forgotPassReqValidation, authController.forgotPassword)
  .patch(resetPassReqValidation, authController.resetPassword);

router
  .route('/')
  .get(authController.protect, userController.getUser)
  .post(authController.createUser);

router.post('/login', authController.login);
router.delete('/logout', authController.protect, authController.logout);

module.exports = router;
