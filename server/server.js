import express from 'express';
const app = express();

const PORT = 3002;
app.use(express.json());

app.get('/',(req,res)=>{
    console.log('API is running');
    res.send("API IS RUNNING")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

