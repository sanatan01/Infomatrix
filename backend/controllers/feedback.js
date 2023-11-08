const {StatusCodes} = require('http-status-codes');
const Feedback = require('../models/Feedback');


const sendFeedback = async (req, res) => {
    req.body.owner = req.user.username
    console.log(req.body)
    try {
        const feedback = await Feedback.create(req.body)
        res.status(StatusCodes.CREATED).json({feedback : feedback})
    } catch(error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({msg : "Please try again"})
    }
}

module.exports = {
    sendFeedback
}