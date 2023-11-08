const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Enter username'],
        unique: true,
        minlength: 8,
        maxlength: 24,
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        minlength: 8,
    },
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ id: this.id, username: this.username }, process.env.TOKEN_SECRET);
}

UserSchema.methods.comparePassword = async function (incomingPass) {
    const isValid = await bcrypt.compare(incomingPass, this.password)
    return isValid
}

module.exports = mongoose.model('User', UserSchema)