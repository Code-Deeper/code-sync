const express = require('express')
var colors = require('colors');
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

const port =  process.env.DEVELOPMENT_PORT || 5000

// DB Connection    
connectDB()

const app = express()

// Middleware
app.use(express.json());
app.use(
    cors({
        allowedHeaders: ['Content-Type'],
        credentials: true,
        origin: ['http://localhost:3000']
    })
);

// Controllers
app.use('/api/room/',require('./routes/room.route'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})