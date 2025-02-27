import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import redisClient from "./utils/radisClient";
import path from "path";
dotenv.config()
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // ✅ Parses URL-encoded form data


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))

app.use("/api", userRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route Not Found" })
})

mongoose.connect(process.env.MONGO_URL as string)

const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", async () => {
    console.log("MONGO CONNECTED");
    // ✅ Check Redis Connection on Startup
    try {
        await redisClient.ping();
        console.log(" Redis is Ready");
    } catch (error) {
        console.error(" Redis Connection Failed at Startup:", error);
    }

    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
})

// console.log("Server running on http://localhost:5000");

