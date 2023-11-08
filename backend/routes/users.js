const express = require('express');
const router = express.Router()

const {
    getAllUsers,
    createUser,
    getUser
} = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser)
router.route('/:username').get(getUser)

module.exports = router