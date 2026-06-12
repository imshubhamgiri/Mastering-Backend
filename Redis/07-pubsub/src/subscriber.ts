import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe('notifications', (err) => {
    if (err) {
        console.error('Failed to subscribe: ', err);
        return;
    }
    console.log('Subscribed successfully! This client is currently subscribed to the notifications channel.');
});


subscriber.on('message',async (channel, message) => {
    console.log("Received on ", channel, ": ", JSON.parse(message));

    if(channel==='notifications'){
        const payload = JSON.parse(message);
        console.log('recieve the data' , payload)


        await Promise.all([
            sendEmail(payload),
            sendMessage(payload)
        ])
    }
});



async function sendEmail(data:any){
    console.log(`  📧 [Email] Constructing invoice for ${data.customerEmail}...`);
  await new Promise((res) => setTimeout(res, 1200)); // Heavy SMTP transactional overhead simulated
  console.log(`  📧 [Email] Invoice dispatched cleanly for ${data.userId}!`);
}
async function sendMessage(data:any){
    console.log(`  📱 [Push] Blasting alert dispatch sequence to User ID: ${data.userId}...`);
  await new Promise((res) => setTimeout(res, 600)); // FCM network ping simulated
  console.log(`  📱 [Push] Device ping confirmed for ${data.userId}: "Your notification  is on the way!"`);
}

