import io from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();
const socket = io(process.env.REACT_APP_BACKEND_URL);

export default socket;