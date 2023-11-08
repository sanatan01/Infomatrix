const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
} = require('../controllers/auth');


router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

module.exports = router