const express = require("express")
const router = express.Router()

const { sendFeedback } = require('../controllers/feedback')

router.route('').post(sendFeedback)

module.exports = router