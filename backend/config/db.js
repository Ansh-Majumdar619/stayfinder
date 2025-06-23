// Importing mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempting to connect to the MongoDB database using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Logging the host of the connected MongoDB instance
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // Logging any error that occurs during the connection attempt
    console.error(`Error: ${err.message}`);
    // Exiting the process with a failure code
    process.exit(1);
  }
};

// Exporting the connectDB function for use in other parts of the application
export default connectDB;
