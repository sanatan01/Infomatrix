const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({msg : (err.message || "Something went wrong")})
}

module.exports = errorHandler

