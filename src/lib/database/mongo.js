// src/lib/database/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let isConnected = null; // Keep track of connection status

const dbConnect = async () => {
  if (isConnected) {
    // If already connected, return the connection
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "dugout",
    });

    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB using Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default dbConnect;
