const mongoose = require("mongoose");

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return mongoose.connection;
  }
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "ongodb+srv://kyawmin7674:0lZW9cwTta0cqUR9@cluster0.f0ikhru.mongodb.net/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );
    console.log("Database connection successful");
  } catch (error) {
    console.log("Database connection failed");
    throw error; // Rethrow the error after logging
  }
};

module.exports = connectDb;
