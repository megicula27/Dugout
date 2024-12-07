import { createClient } from "redis";

// Create the Redis client
const client = createClient({
  username: "default", // Use your actual Redis username if different
  password: "Lj8ZTbjCidkohSSPZ6wD5Sg1toIh4Qge", // Use your actual Redis password if different
  socket: {
    host: "redis-13217.c301.ap-south-1-1.ec2.redns.redis-cloud.com", // Your Redis host
    port: 13217, // Your Redis port
  },
});

// Handle Redis connection error
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

// Async function to connect and perform Redis operations
async function connectAndUseRedis() {
  try {
    // Ensure connection is established before using Redis
    await client.connect();
    console.log("Connected to Redis successfully!");
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
}

connectAndUseRedis();
export default client;
