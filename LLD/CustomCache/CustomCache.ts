
// interface CustomCache<T>{
//      Cache: Map<string, CacheItem<T>>;
//      ttl: number; 
//     get(key: string): T | undefined;
//     set(key: string, value: T): void;
//     delete(key: string): void;
// }

interface CacheItem<T> {
    value: T;
    expirationTime: number;
}

export class MyCache<K,T>{

    private Cache: Map<K, CacheItem<T>> = new Map<K, CacheItem<T>>();
    private maxSize: number;
    private ttl:number;
   constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
    
    // Background interval to clean up expired items (every minute)
    setInterval(() => this.cleanUpExpired(), 60000);
  }


  public get(key:K):T | undefined {
         const entry = this.Cache.get(key);
        if (!entry) return undefined;

        if(Date.now() > entry.expirationTime) {
            this.Cache.delete(key);
            return undefined;
          }

        const value = entry.value

        const cacheItem: CacheItem<T>= {
            value,
            expirationTime: Date.now() + this.ttl
        }

        this.Cache.set(key , cacheItem);
        return value;  
    }



    public set(key: K, value: T): void {

        if(this.Cache.size >= this.maxSize && !this.Cache.has(key)){
          const firstKey =  this.Cache.keys().next().value
          if (firstKey !== undefined) this.Cache.delete(firstKey);
        }

        const cacheItem: CacheItem<T> = {
            value,
            expirationTime: Date.now() + this.ttl
        };
        this.Cache.set(key, cacheItem);
    }

    public delete(key: K): void {
        this.Cache.delete(key);
    }

    public clear() : void{
        this.Cache.clear();
    }

    private cleanUpExpired(): void {
        const now = Date.now();
        for (const [key, entry] of this.Cache.entries()) {
          if (now > entry.expirationTime) {
            this.Cache.delete(key);
          }
        }
      }
}