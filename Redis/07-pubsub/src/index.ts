import express from 'express'
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


app.post("/notification",async(req ,res)=>{
    const payload ={
        customerEmail :req.body.email,
        userId:req.body.userId,
        createdAt: new Date().toLocaleDateString()
    }


  const recipient =  await publisher.publish("notifications", JSON.stringify(payload));

    res.json({
        sucess:true,
        message:"notification send to "+recipient+" subscribers"
    })

})

app.listen(3000, ()=>{
    console.log("server listening on http://localhost:3000");
})

