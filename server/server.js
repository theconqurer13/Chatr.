import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkrouter from './routes/clerkRoutes.js';
import userRouter from './routes/userRoutes.js';
connectDb();

const app = express();
app.use("/api/clerk/webhooks", clerkrouter);
app.use(cors());
// Middleware
app.use(express.json());
app.use(clerkMiddleware())
// API to listen Clerk Webhooks

const PORT = 3002;


app.get('/',(req,res)=>{
    console.log('API is running');
    res.send("API IS RUNNING")
})

app.use('/api/user',userRouter);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


