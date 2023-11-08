const mongoose = require('mongoose')
const  { MessageSchema } = require("./Message");
const ChatSchema = new mongoose.Schema({
    title : {
        type : String,
        default : "New chat",
        minlength : 6,
    },
    messages : {
        type : [MessageSchema],
    },
    owner : {
        type : String,
    }
})

module.exports = mongoose.model('Chat', ChatSchema)