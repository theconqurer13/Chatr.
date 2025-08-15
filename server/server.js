import express from 'express';
import cors from 'cors';
import connectDb from './configs/db.js';

connectDb();

const app = express();
app.use(cors());
const PORT = 3002;
app.use(express.json());

app.get('/',(req,res)=>{
    console.log('API is running');
    res.send("API IS RUNNING")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

