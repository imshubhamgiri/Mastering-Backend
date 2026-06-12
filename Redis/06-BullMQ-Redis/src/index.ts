// src/index.ts
import express from 'express'
import { emailQueue } from './queue'

const app = express();
app.use(express.json());

app.post('/welcome-email',async (req, res) => {
    const job = await emailQueue.add(
        "emailQueue", // Ensure this matches the queue name in worker.ts
        {
            to: req.body.to,
            name: req.body.name || "Learner",
            subject: req.body.subject || ' ',
        },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        }
    )

    

        res.json({
        success: true,
        message: 'Welcome email job added to the queue',
        job: job
    })
})

app.listen(3000, () => {
    console.log('listening on http://localhost:3000');
})