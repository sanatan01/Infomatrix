const express = require('express');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer')) {
            throw new Error("Unauthenticated")
        }
        const token = header.split(' ')[1];
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = { id: payload.id, username: payload.username }
        next()
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ 'msg': 'Wrong password' })
    }
}

module.exports = checkAuth