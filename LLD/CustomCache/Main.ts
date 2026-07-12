import { MyCache } from "./CustomCache";


const userCache = new MyCache<string, { name: string }>(50, 10000);

userCache.set('user-1',{name:'shubham'});

console.log(userCache.get('user-1'));

setTimeout(() => {
    console.log(userCache.get("user-1")); // undefined
  }, 100)