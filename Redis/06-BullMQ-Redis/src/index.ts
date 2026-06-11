import express from 'express'
import {emailQueue} from './queue'


const app = express();
app.use(express.json());


app.post('/welcome-email',(req ,res)=>{
    const job = emailQueue.add(
        "send-welcome-email",
    {
    to:req.body.to,
    name:req.body.name || "Learner",
    subject:req.body.subject || ' ',
    
    },{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:1000
        }
    }
    )
})






app.listen(3000,()=>{
    console.log('listening on http://localhost:3000');
})