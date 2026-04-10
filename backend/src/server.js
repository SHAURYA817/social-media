import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connect } from 'mongoose';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true, // to allow cookies to be sent from frontend to backend
}))
app.use(express.json()) 
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
import { connectDB } from './lib/db.js';



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})