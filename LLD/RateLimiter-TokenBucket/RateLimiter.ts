import { Redis } from 'ioredis';


class TokenBucketRateLimiter {
    private redisClient: Redis; // Redis client instance
    private readonly bucketCapacity: number; // Maximum tokens the bucket can hold
    private readonly refillRate: number; // Tokens added per second

    constructor(bucketCapacity: number, refillRate: number , redisClient: Redis) {
        this.bucketCapacity = bucketCapacity;
        this.refillRate = refillRate; // Tokens added per second
        this.redisClient = redisClient;
    }

    //Java implementation of the isAllowed method for reference
    /**
     *  public boolean isAllowed(String clientId) {
    String keyCount = "rate_limit:" + clientId + ":count";
    String keyLastRefill = "rate_limit:" + clientId + ":lastRefill";

    long currentTime = System.currentTimeMillis();

    // Fetch current state
    Transaction transaction = jedis.multi();
    transaction.get(keyLastRefill);
    transaction.get(keyCount);
    var results = transaction.exec();

    long lastRefillTime = results.get(0) != null ? Long.parseLong((String) results.get(0)) : currentTime;
    int tokenCount = results.get(1) != null ? Integer.parseInt((String) results.get(1)) : bucketCapacity;

    // Refill tokens
    long elapsedTimeMs = currentTime - lastRefillTime;
    double elapsedTimeSecs = elapsedTimeMs / 1000.0;
    int tokensToAdd = (int) (elapsedTimeSecs * refillRate);
    tokenCount = Math.min(bucketCapacity, tokenCount + tokensToAdd);

    // Check if the request is allowed
    boolean isAllowed = tokenCount > 0;

    if (isAllowed) {
        tokenCount--; // Consume one token
    }

    // Update Redis state
    transaction = jedis.multi();
    transaction.set(keyLastRefill, String.valueOf(currentTime));
    transaction.set(keyCount, String.valueOf(tokenCount));
    transaction.exec();

    return isAllowed;
}
    */

    async isAllowed(clientId: string): Promise<boolean> {

        let keyCount = "rate_limit:" + clientId + ":count";
        let keyLastRefill = "rate_limit:" + clientId + ":lastRefill";

        let currentTime = Date.now();

        // 1. Initialize the multi-command chain
        // const transaction = this.redisClient.multi();
    
        // // 2. Queue the GET commands
        // transaction.get(keyLastRefill);
        // transaction.get(keyCount);
    
        // // 3. Execute the transaction
        // // 'results' will be an array: [string | null, string | null]
        // // Cast the exec() response to the exact ioredis return type
        // const results = (await this.redisClient.multi().get(keyLastRefill).get(keyCount).exec()) as [Error | null, string | null][] | null;

        // // Map the tuples to get a clean (string | null)[] array
        // const parsedResults: (string | null)[] = results 
        //     ? results.map(([err, val]) => val) 
        //     : [null, null];
        
        // let lastRefillTime = parsedResults[0] !== null ? parseInt(parsedResults[0] as string) : currentTime;
        // let tokenCount = parsedResults[1] !== null ? parseInt(parsedResults[1] as string) : this.bucketCapacity;

        for(let attempt = 0; attempt < 3; attempt++) {
            await this.redisClient.watch(keyLastRefill, keyCount);
            const [lastRefillRaw, countRaw] = await Promise.all([
                this.redisClient.get(keyLastRefill),
                this.redisClient.get(keyCount)
            ]);
            
            // Parse the results cleanly
            let lastRefillTime = lastRefillRaw ? parseInt(lastRefillRaw) : currentTime;
            let tokenCount = countRaw ? parseInt(countRaw) : this.bucketCapacity;
    
    
    
            // Refill tokens
    
            let elapsedTimeMs = currentTime - lastRefillTime;
            let elapsedTimeSecs = elapsedTimeMs / 1000.0;
            let tokensToAdd = Math.floor(elapsedTimeSecs * this.refillRate);
            tokenCount = Math.min(this.bucketCapacity, tokenCount + tokensToAdd);
    
            // Check if the request is allowed
    
            const isAllowed = tokenCount > 0;
    
            if (isAllowed) {
                tokenCount--; // Consume one token
            }
    
            let ONE_HOUR_IN_SECONDS = 3600; // 1 hour in seconds
            // Update Redis state
            const transaction = this.redisClient.multi();
            transaction.set(keyLastRefill, currentTime.toString(), "EX", ONE_HOUR_IN_SECONDS);
            transaction.set(keyCount, tokenCount.toString(), "EX", ONE_HOUR_IN_SECONDS);

            // 5. Execute transaction
            const results = await transaction.exec();

            if (results === null) {
                // Transaction failed due to a watch condition, retry
                continue;
            }
    
            return isAllowed;
        }

        return false; // If all attempts fail, return false
    }

    

}

export { TokenBucketRateLimiter };