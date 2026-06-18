import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.url}`);
    next();
});

app.post('/post/:id/view', async (req, res) => {
    const {id} = req.params
    const postcountkey = `post:view:${id}`
    const result = await redis.incr(postcountkey);
    return res.json({
        sucess: true,
        count: result
    })
})


const ScoreKey = 'game:leaderboard';

app.post('/leaderboard/score', async (req, res) => {
    const { score, userId } = req.body
    const Score = await redis.zincrby(ScoreKey, score , userId);
    res.json({
        success: true,
        Score
    })
});

app.get('/leaderboard', async (req, res) => {
    const top10 = await redis.zrevrange(ScoreKey, 0, 9, 'WITHSCORES');
    const formattedLeaderboard = [];
        for (let i = 0; i < top10.length; i += 2) {
            formattedLeaderboard.push({
                userId: top10[i],
                score: parseInt(top10[i + 1], 10) // Convert string score to a number
            });
        }

        res.json({
            success: true,
            leaderboard: formattedLeaderboard
        })
});

app.get('/leaderboard/:userid/rank', async (req, res) => {
    const { userid } = req.params;
    const result = await redis.zrevrank(ScoreKey, userid);
    res.json({ success: true, rank: result });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
 });


 process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    redis.quit();
    redis.disconnect();
    process.exit(0);
 })
