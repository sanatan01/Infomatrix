const express = require("express")
const router = express.Router()
const checkAuth = require('../middleware/auth');
const {
    getChats,
    getChat,
    createChat,
    deleteChat,
    receiveMessage
} = require('../controllers/chats')

router.route('').get(getChats).post(createChat)
router.route('/:chatID').get(getChat).delete(deleteChat).patch(receiveMessage)

module.exports = router