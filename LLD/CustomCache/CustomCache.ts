interface CacheItem<T> {
    value: T;
    expirationTime: number;
}

// export class MyCache<K,T>{

//     private Cache: Map<K, CacheItem<T>> = new Map<K, CacheItem<T>>();
//     private maxSize: number;
//     private ttl:number;
//    constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) {
//     this.maxSize = maxSize;
//     this.ttl = ttl;
    
//     // Background interval to clean up expired items (every minute)
//     setInterval(() => this.cleanUpExpired(), 60000);
//   }


//   public get(key:K):T | undefined {
//          const entry = this.Cache.get(key);
//         if (!entry) return undefined;

//         if(Date.now() > entry.expirationTime) {
//             this.Cache.delete(key);
//             return undefined;
//           }

//         const value = entry.value

//         const cacheItem: CacheItem<T>= {
//             value,
//             expirationTime: Date.now() + this.ttl
//         }

//         this.Cache.set(key , cacheItem);
//         return value;  
//     }



//     public set(key: K, value: T): void {

//         if(this.Cache.size >= this.maxSize && !this.Cache.has(key)){
//           const firstKey =  this.Cache.keys().next().value
//           if (firstKey !== undefined) this.Cache.delete(firstKey);
//         }

//         const cacheItem: CacheItem<T> = {
//             value,
//             expirationTime: Date.now() + this.ttl
//         };
//         this.Cache.set(key, cacheItem);
//     }

//     public delete(key: K): void {
//         this.Cache.delete(key);
//     }

//     public clear() : void{
//         this.Cache.clear();
//     }

//     private cleanUpExpired(): void {
//         const now = Date.now();
//         for (const [key, entry] of this.Cache.entries()) {
//           if (now > entry.expirationTime) {
//             this.Cache.delete(key);
//           }
//         }
//       }
// }


export class MyCache<K,T>{
    private cache: Map<K, CacheItem<T>> = new Map<K, CacheItem<T>>;
    private maxSize:number;
    private ttl:number;

    constructor(maxSize:number , ttl:number){
        this.maxSize = maxSize
        this.ttl = ttl;
        setInterval(() => {
        this.clearCache();
        }, 60000);
    }

    get(key:K):T | undefined{
    const entry = this.cache.get(key);

    if(!entry) return undefined;
    
    if(entry.expirationTime< Date.now()){
        console.log('expired');
        return undefined;
    }
  
    const cacheItem: CacheItem<T> ={
       value:entry.value,
       expirationTime: Date.now() + this.ttl
    }
    this.cache.set(key ,cacheItem);

    return entry.value;
   
    }

    set(key:K, Data:T){
        if(this.cache.size>=this.maxSize && !this.cache.has(key)){
            const firstKey = this.cache.keys().next().value
            if(firstKey) this.cache.delete(firstKey);
            
        }

        const cacheItem: CacheItem<T> ={
            value:Data,
            expirationTime: Date.now() + this.ttl
        }

        this.cache.set(key , cacheItem);
    }
    
   

         public delete(key: K): void {
            this.cache.delete(key);
        }
    
        public clear() : void{
            this.cache.clear();
        }

        private clearCache(){
            const time = Date.now();

            for(const [key , entries] of this.cache.entries()){
                if(entries.expirationTime<time){
                    this.cache.delete(key);
                }
            }
        }

      
}
