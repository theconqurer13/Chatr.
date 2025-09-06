import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    // Debug logging for mongoose
    mongoose.set('debug', true);
    
    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('ℹ️  MongoDB disconnected');
    });

    // Log the connection attempt
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, options);
    
    console.log(`🚀 Database connection established to ${mongoose.connection.host}`);
    console.log(`📚 Database name: ${mongoose.connection.name}`);

  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDb;
