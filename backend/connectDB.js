const mongoose = require("mongoose");
require("dotenv").config();
const winstonLogger = require("./logging");

// Improved connection configuration
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_DB_CLIENT, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      // Add these additional options for better stability
      heartbeatFrequencyMS: 2000,
      retryWrites: true,
      w: "majority",
      family: 4, // Force IPv4
    })
    .then(() => {
      console.log("Connected to MongoDB Atlas");
      winstonLogger.info("Connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      winstonLogger.error({
        message: "MongoDB connection error",
        stack: err.stack,
      });
      // Don't exit the process, let it retry
      // process.exit(1);
    });

  // Add connection event listeners
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    winstonLogger.error({
      message: "MongoDB connection error",
      stack: err.stack,
    });
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    winstonLogger.info("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
    winstonLogger.info("MongoDB reconnected");
  });
};

// Export the connection function
module.exports = connectDB;
