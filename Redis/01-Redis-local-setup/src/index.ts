import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
console.log('Express server initialized')

const redis =  new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

app.get('/redis', async (req, res) => {
    try {
        const value = await redis.ping();
        res.json({ redis: value });
    } catch (error) {
        console.error('Error fetching from Redis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/mongoose', async (req, res) => {
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';
    try {  
        await mongoose.connect(url)
        const db = mongoose.connection;
        const isConnected = db.readyState === 1; // 1 means connected
        res.json({
             mongoose: isConnected ? 'Connected' : 'Not Connected',
             DbName: db.name
             });
    } catch (error) {
        console.error('Error fetching from Mongoose:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

if(redis.status === 'ready') {
    console.log('Redis client is ready')
}else{
    console.error('Failed to connect to Redis')
}


// setTimeout(() => {
//   console.log('Shutting down...');
//   process.exit(0);
// }, 5000);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});