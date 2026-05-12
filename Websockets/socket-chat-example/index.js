import express from 'express';
// import socketio from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import {Server} from 'socket.io';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(process.cwd(), 'public')));


app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected' , socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
})