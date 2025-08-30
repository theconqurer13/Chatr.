import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import http from 'http';
import friendsRouter from './routes/friendsRoutes.js';
import pendingRouter from './routes/pendingRoutes.js';
import authRouter from './routes/authRouter.js';
import connectCloudinary from './configs/cloudinary.js';
connectDb();
connectCloudinary();
const app = express();
const server = http.createServer(app);

app.use(cors());
// Middleware
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));

const PORT = 3002;

app.get('/',(req,res)=>{
    console.log('API is running');
    res.send("API IS RUNNING")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter);
app.use('/api/pending',pendingRouter);
app.use('/api/friends',friendsRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
