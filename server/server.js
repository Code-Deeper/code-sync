const express = require('express')
var colors = require('colors');
const connectDB = require('./config/db')

const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

const port =  process.env.DEVELOPMENT_PORT || 5000

// DB Connection    
connectDB()


const app = express()



// Middleware
app.use(express.json());


// Routes





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})