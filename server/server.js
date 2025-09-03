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
import chatRouter from './routes/chatRouter.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
connectDb();
connectCloudinary();
const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
}});
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
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);

// test scoket connection
const onlineUsers = new Set();
io.on('connection',(socket)=>{
    console.log('✅ Socket connection established:', socket.id);
    console.log('📊 Total connected clients:', io.engine.clientsCount);

    socket.on('join-room',(roomId)=>{
        socket.join(roomId);
        onlineUsers.add(socket.id);
        console.log(`🏠 Socket ${socket.id} joined room: ${roomId}`);
        console.log(`📋 Socket rooms:`, Array.from(socket.rooms));
        
        // Broadcast user online status to friends
        socket.broadcast.emit('user-online', roomId);
    })

    socket.on('send-message',(message)=>{
        console.log('📤 Received message to broadcast:', message);
        console.log('👥 Broadcasting to members:', message.members);
        
        // Broadcast to all members in the chat EXCEPT the sender
        message.members.forEach(memberId => {
            if (memberId !== message.senderId) { // Don't send back to sender
                console.log(`📨 Sending to room: ${memberId}`);
                io.to(memberId).emit('receive-message', message);
            } else {
                console.log(`🚫 Skipping sender: ${memberId}`);
            }
        });
        
        // Also broadcast to the chat room if it exists (excluding sender)
        if (message.chatId) {
            console.log(`📨 Sending to chat room: ${message.chatId}`);
            socket.to(message.chatId).emit('receive-message', message); // Use socket.to() instead of io.to() to exclude sender
        }
    })

    socket.on('user-online', (roomId) => {
        console.log(`🏠 Socket ${socket.id} joined room: ${roomId}`);
        console.log(`📋 Socket rooms:`, Array.from(socket.rooms));
        
        // Broadcast user online status to friends
        socket.broadcast.emit('user-online', roomId);
        io.to(socket.id).emit('online-users', Array.from(onlineUsers));
    });

    socket.on('mark-messages-read', (data) => {
        console.log('📖 Messages marked as read:', data);
        // Broadcast to the chat partner that messages have been read
        io.to(data.chatPartnerId).emit('messages-read', data);
    });
    
    socket.on('disconnect',(reason)=>{
        console.log('❌ Socket disconnected:', socket.id, 'Reason:', reason);
        console.log('📊 Remaining connected clients:', io.engine.clientsCount);
        
        // Get user ID from socket rooms and broadcast offline status
        const rooms = Array.from(socket.rooms);
        const userId = rooms.find(room => room !== socket.id); // Find user room (not socket room)
        if (userId) {
            onlineUsers.delete(socket.id);
            socket.broadcast.emit('user-offline', userId);
        }
    });
    
    socket.on('error', (error) => {
        console.error('🚨 Socket error:', error);
    });
});

// Add connection error handling
io.engine.on("connection_error", (err) => {
    console.error('🚨 Connection error:', err.req);
    console.error('🚨 Error code:', err.code);
    console.error('🚨 Error message:', err.message);
    console.error('🚨 Error context:', err.context);
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
