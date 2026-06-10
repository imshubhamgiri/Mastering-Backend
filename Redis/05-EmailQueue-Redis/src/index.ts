import express from 'express'
import Redis from 'ioredis'


const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


const QUEUE_KEY = 'queue:emails';  //Standard practice to use a prefix for keys in Redis to avoid collisions and improve organization.

app.post('/send-email', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No Body',
        timestamp: Date.now(),
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.status(202).json({ message: 'Email added to queue' , job});
});