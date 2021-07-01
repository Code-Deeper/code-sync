const express = require('express')
var colors = require('colors');
const http = require('http')
const connectDB = require('./config/db')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });
const app = express()

const port = process.env.DEVELOPMENT_PORT || 5000
app.set('port', port);
const server = http.createServer(app);

// DB Connection    
connectDB()


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
app.use('/api/room/', require('./routes/room.route'));

// Socket.io
const { Server, Socket } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  socket.on('joinroom', (roomId) => {
    socket.join(roomId);
  });
  socket.on('updateBody', (value) => {
    io.emit('updateBody', value);
  });
  socket.on('updateInput', (value) => {
    io.emit('updateInput', value);
  });
  socket.on('updateLanguage', (value) => {
    io.emit('updateLanguage', value);
  });
  socket.on('updateOutput', (value) => {
    io.emit('updateOutput', value);
  });
});



server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})