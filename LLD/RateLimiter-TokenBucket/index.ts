// import express from "express";
import Redis from "ioredis";
import { TokenBucketRateLimiter } from "./RateLimiter";

// const app = express();
// const redisClient = new Redis();


// const RateLimiter = new TokenBucketRateLimiter(3, 1, redisClient);


// Example usage

    // async function testRateLimter(){
    //     const clientId = "client1";
    //     let request = []
    //     const isAllowed = await RateLimiter.isAllowed(clientId);
    //     for(let i = 0; i < 5; i++) {
    //         // const isAllowed = await RateLimiter.isAllowed(clientId);
    //         // console.log(`Request allowed for client ${clientId}: ${isAllowed}`);
    //         request.push(RateLimiter.isAllowed(clientId));
    //     }

    //     await Promise.all(request).then((results) => {
    //        for (let i = 0; i < results.length; i++) {
    //         console.log(`Request ${i + 1} allowed for client ${clientId}: ${results[i]}`);
    //        }
    //     })
    //     console.log(`Request allowed for client ${clientId}: ${isAllowed}`);
    // }


// testRateLimter();





async function runConcurrentTest() {
    // 1. Create a setup client to clear keys
    const setupClient = new Redis();
    await setupClient.del("rate_limit:test_user:count");
    await setupClient.del("rate_limit:test_user:lastRefill");
    await setupClient.quit();

    // 2. Instantiate 5 distinct rate limiters, each mimicking a unique server connection thread
    const limiters = Array.from({ length: 5 }, () => {
        const client = new Redis();
        return new TokenBucketRateLimiter(3, 1, client);
    });

    console.log("🚀 Firing 5 true concurrent requests...");
    
    // 3. Execute concurrently
    const results = await Promise.all(limiters.map(limiter => limiter.isAllowed('test_user')));

    console.log("📊 Results:", results);
    // Output will now properly look like: [true, true, true, false, false] (order can vary depending on network speed)

    // Cleanup connections
    await Promise.all(limiters.map(l => (l as any).redisClient.quit()));
}

runConcurrentTest();


