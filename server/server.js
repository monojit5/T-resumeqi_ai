import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './src/database/db.js';
import { connectRedis } from './src/config/redis.js';
import { userRouter } from './src/routes/userRoute.js';
import { resumeRouter } from './src/routes/resumeRoute.js';
import { subscriptionRouter } from './src/routes/subscriptionRoute.js';
import { testAi } from './src/config/testAi.js';
const app = express();




const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://t-resumeqi-ai.vercel.app",
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.use("/user", userRouter)
app.use("/resume", resumeRouter)
app.use("/subscription", subscriptionRouter)

connectDB();
connectRedis();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
