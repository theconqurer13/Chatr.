import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("✅ MongoDB connected successfully"));
    await mongoose.connect(`${process.env.MONGODB_URL}/chatr`);
    console.log('🚀 Database connection established');
  } catch (error) {
    console.log("❌ DB connection error:", error.message);
  }
}

export default connectDb;
