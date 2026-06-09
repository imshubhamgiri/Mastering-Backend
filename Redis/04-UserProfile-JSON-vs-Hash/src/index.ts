import express from 'express';
import Redis from 'ioredis';
import type {Request, Response , NextFunction} from 'express';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

//write logger for req and res
const logger = (req: Request, res: Response, next: NextFunction) =>{
    console.log(`${req.method}  ${req.url}`);
    next();
};
app.use(logger);

app.post('/user/:id/json', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    await redis.set(`user:${userId}:json`, JSON.stringify(userData));
    res.status(200).json({
        message: 'User profile saved as JSON',
    });
});

app.get('/user/:id/json', async (req, res) => {
    const userId = req.params.id;
    const raw = await redis.get(`user:${userId}:json`);
    res.json({
        data: raw ? JSON.parse(raw) : null,
    })
});


app.post('/user/:id/hash', async (req, res) => {
    const userId = req.params.id; 
     await redis.hset(`user:${userId}:hash`, req.body);
    res.json({
        message: 'User profile saved as Hash',
    })
})


app.get('/user/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const data = await redis.hgetall(`user:${userId}:hash`);
    res.json({
        data,
    })
})


app.listen(3000,()=>{
    console.log('Server is running on port http://localhost:3000');
});
