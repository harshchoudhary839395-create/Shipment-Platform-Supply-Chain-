const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sami-tech-supply-tracker', {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Warning: MongoDB connection failed: ${error.message}`);
    console.error('Continuing without database connection. Auth and data endpoints will not work until MongoDB is available.');
    return null;
  }
};

module.exports = connectDB;