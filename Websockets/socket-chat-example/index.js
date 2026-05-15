import express from 'express';
import { createServer } from 'http';
import path from 'path';
import {Server} from 'socket.io';
import { connectDB, Message } from './src/db.js';

const app = express();
const PORT = 3000;
const server = createServer(app);
const io = new Server(server,{
  connectionStateRecovery: {}
});

app.use(express.static(path.join(process.cwd(), 'public')));



app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Connect to MongoDB
connectDB();

io.on('connection', async (socket) => {
  console.log('a user connected' , socket.id);
  
  // When connection drops (or page refresh/manual connect), fetch missed messages
  if (!socket.recovered) {
    try {
      const serverOffset = socket.handshake.auth.serverOffset;
      const query = serverOffset ? { _id: { $gt: serverOffset } } : {};
      
      const missedMessages = await Message.find(query);
      missedMessages.forEach((doc) => {
        // Send previous messages and their database _id as the offset
        socket.emit('chat message', doc.content, doc._id.toString());
      });
    } catch (e) {
      console.error(e);
    }
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('chat message', async (msg) => {
    console.log('message: ' + msg);
    try {
      // Save message to database
      const newMessage = new Message({ content: msg });
      await newMessage.save();
      
      // Emit the message and its new database _id to everyone
      io.emit('chat message', newMessage.content, newMessage._id.toString());
    } catch (e) {
      console.error('Error saving message:', e);
    }
  });
});

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
})