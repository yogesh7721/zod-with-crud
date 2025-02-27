"use strict";
// import Redis from "ioredis";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const redisClient = new Redis({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: Number(process.env.REDIS_PORT) || 6379,
//     password: process.env.REDIS_PASSWORD || undefined,
// });
// redisClient.on("connect", () => {
//     console.log("Connected to Redis");
// });
// redisClient.on("error", (err) => {
//     console.error("Redis Error:", err);
// });
// export default redisClient;
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default("redis://127.0.0.1:6379");
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});
exports.default = redisClient;
