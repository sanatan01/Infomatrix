const mongoose = require('mongoose')

const MessageSchema = {
    content : {
        type : String,
        default : '',
    },
    timestamp : {
        type : Number,
        default : Date.now()
    },
    role : {
        type : String,
    }
}

Message = mongoose.model('Message', MessageSchema)

module.exports = 
{
    MessageSchema,
    Message,
}