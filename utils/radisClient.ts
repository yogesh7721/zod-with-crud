import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379"; // Use environment variable for security

const redisClient = new Redis(REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
    reconnectOnError: (err) => {
        console.error("Redis Connection Error:", err);
        return true; // Try to reconnect
    },
});

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

export default redisClient;





// import Redis from "ioredis";

// const redisClient = new Redis("redis://127.0.0.1:6379");

// redisClient.on("connect", () => {
//     console.log("Connected to Redis");
// });

// redisClient.on("error", (err) => {
//     console.error("Redis Error:", err);
// });

// export default redisClient;

// Yogesh - free - db
// redis - 15576.c301.ap - south - 1 - 1.ec2.redns.redis - cloud.com: 15576
// redis - cli - u redis://default:ZQZzQT7CxOo4qUvvpJrpEPGcDku9jSQP@redis-15576.c301.ap-south-1-1.ec2.redns.redis-cloud.com:15576
