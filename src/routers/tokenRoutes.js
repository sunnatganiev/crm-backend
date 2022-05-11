const router = require('express').Router();
const { refreshToken } = require('../controller/tokenController');

router.get('/', refreshToken);

module.exports = router;
