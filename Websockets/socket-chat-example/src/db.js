import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  client_offset: { type: String, unique: true, sparse: true }
});

export const Message = mongoose.model('Message', messageSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/socket_chat');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
