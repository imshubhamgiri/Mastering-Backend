import express from 'express';
import Redis from 'ioredis';
const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
app.use(express.json());


//Note: if you want to keep keys keep it in a separate file and import it here, for better maintainability and to avoid hardcoding keys in multiple places. those files and called enum files or constant files
const BANNER_KEY  = 'app:banner'
// Check Redis connection
app.post('/banner', async (req, res) => {
    console.log('Received banner update request with body:', req.body);
    try {
     await redis.set(BANNER_KEY , req.body.banner || "Welcome to Redis Tutorial"); 
     console.log(await redis.get(BANNER_KEY));
     res.json({
        success:true
     })
    } catch (error) {
        res.status(400).json({
            error,
            message:`error whie saving banner ${error as Error}`
        })
    }
   
});
app.get('/banner', async (req, res) => {
    const banner = await redis.get(BANNER_KEY);
    if (banner) {
        res.json({ banner });
    } else {
        res.status(404).json({ error: 'Banner not found' });
    }
});

app.get('/', async (req, res) => {
    const value =await redis.ping();
    res.json({ message: 'Welcome to the Site Banner API', redisStatus: value });
});
app.delete('/banner' , async(req, res)=>{
    await redis.del(BANNER_KEY);
    res.json({
        success:true 
    })
})
app.get('/redis/exist' , async(req , res)=>{
    const exist = redis.exists(BANNER_KEY);
    res.json({
        exists :exist
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})