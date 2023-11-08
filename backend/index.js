const express = require('express');
const cors = require('cors')
const port = 8000;
const app = express();
// const bodyParser = require('body-parser');
require('dotenv').config()
const users = require('./routes/users');
const chats = require('./routes/chats');
const feedback = require('./routes/feedback');
const authRouter = require('./routes/auth');
const checkAuth = require('./middleware/auth');
const errorHandler= require('./middleware/error-handler');
const connectToDb = require('./db/connect');

var options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(express.json());
app.use(cors(options))
// app.options('*', cors())
app.use('/api/users', users);
app.use('/api/chats', checkAuth, chats);
app.use('/api/feedback', checkAuth, feedback);
app.use('/api/auth', authRouter);
app.use(errorHandler)

const serve = async () => {
    try {
        // console.log(process.env.MONGO_URI)
        await connectToDb(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server up and listening on port ${port}`)
        })
    }
    catch (error){
        console.log(error);
    }
}

serve()