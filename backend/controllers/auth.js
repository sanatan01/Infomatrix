const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')


const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            throw new Error('Please provide email and password')
        }

        const user = await User.create({ username: username, password: password });
        const token = user.createJWT()
        res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "The request was bad" })
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            throw new Error('Please provide email and password')
        }
        const user = await User.findOne({ username })
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isValid = await user.comparePassword(password)
        if(!isValid) {
            throw new Error("Wrong password")
        }
        const token = user.createJWT()
        res.status(StatusCodes.OK).json({ user: { username: user.username }, token })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "The request was bad, try again" })
    }
}

module.exports = {
    registerUser,
    loginUser,
}