const {StatusCodes} = require('http-status-codes');
const Chat = require('../models/Chat');
const {Message} = require('../models/Message');
const chatResponse = require('../chatbot')


const getChats = async (req, res) => {
    try{
        const chats = await Chat.find({owner : req.user.username})
        res.status(StatusCodes.OK).json({chats : chats})
    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : 'The chats could not be fetched'})
    }
}
const createChat = async (req, res) => {
    req.body.owner = req.user.username
    try {
        const chat = await Chat.create(req.body)
        res.status(StatusCodes.CREATED).json({chat : chat})
    } catch(error) {
        res.status(StatusCodes.BAD_REQUEST).json({msg : "The format is bad."})
    }     
}
const getChat = async (req, res) => {
    const owner = req.user.username
    const chatID = req.params.chatID
    const chat = await Chat.findOne({owner : owner, _id : chatID})
    if(!chat) {
        res.status(StatusCodes.NOT_FOUND).json({msg : 'The chat could not be found'})
    }
    res.status(StatusCodes.OK).json({chat : chat})
}

const deleteChat = async (req, res) => {
    const owner = req.user.username
    const chatID = req.params.chatID
    const chat = await Chat.findByIdAndRemove(chatID)
    if(!chat) {
        res.status(StatusCodes.NOT_FOUND).json({msg : 'The chat could not be found'})
    }
    res.status(StatusCodes.OK).json({msg : "Deleted message successfully"})
}

const receiveMessage = async (req, res) => {
    console.log('hit')
    
    const owner = req.user.username
    const chatID = req.params.chatID
    const {latestMessage} = req.body
    console.log(`the contents are ${latestMessage.content}`)
    const chat = await Chat.findById(chatID)
    chat.messages.push({...latestMessage, timestamp : Date.now()})
    const responseMessage = chatResponse(latestMessage.content)
    console.log(responseMessage)
    chat.messages.push({
        timestamp : Date.now(),
        content : responseMessage,
        role : 'assistant',
    })

    await chat.save()
    res.status(StatusCodes.OK).json({msg : "Updated message successfully"})
}

module.exports = {
    getChats,
    createChat,
    getChat,
    deleteChat,
    receiveMessage,
}