const mongoose = require('mongoose')

const FeedbackSchema = {
    owner : {
        type : String,
        required : [true, 'There must be an associated user']
    },
    content : {
        type : String,
        default : '',
    },
}

Feedback = mongoose.model('Feedback', FeedbackSchema)

module.exports = Feedback
