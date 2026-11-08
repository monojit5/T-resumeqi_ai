import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './src/database/db.js';
import { connectRedis } from './src/config/redis.js';
import { userRouter } from './src/routes/userRoute.js';
import { resumeRouter } from './src/routes/resumeRoute.js';
import { testAi } from './src/config/testAi.js';
const app = express();




app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.use("/user", userRouter)
app.use("/resume", resumeRouter)

connectDB();
connectRedis();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
