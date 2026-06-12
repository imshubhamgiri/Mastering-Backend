import {connection} from './queue'
import { Worker } from 'bullmq'


const worker = new Worker('emailQueue' , 
    async (job) => {
        console.log(`Processing job ${job.id} with data:`, job.data);
        // Simulate email sending with a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Email sent to ${job.data.to} with subject: ${job.data.subject}`);
    },
   { connection }
)


worker.on('completed', (job) => {
    //Here you mark the job as done so that the job gets popped up from queue 
    console.log('Email Sent Complete' , job)
});

worker.on('failed', (job, err) => {
    //Here you dont mark the job as done you return the job so that some other worker retries to send the email 
    console.log('Email Sent Failed for :', job,'\n with error:', err);
})