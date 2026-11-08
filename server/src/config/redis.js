import {createClient} from 'redis'

 export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  try{
    await redisClient.connect();
    console.log('Redis connected');
  }catch(err){
    console.error('Error connecting to Redis:', err);
    process.exit(1);
  }
}