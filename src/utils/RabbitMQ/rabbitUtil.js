// lib/rabbitmq.js
import amqp from "amqplib";

let connection;
let channel;

export async function connectRabbitMQ() {
  if (!connection) {
    // Use the service name "rabbitmq" instead of "localhost" for Docker
    const rabbitMQUrl =
      process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";

    try {
      connection = await amqp.connect(rabbitMQUrl);
      channel = await connection.createChannel();
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error.message);
      throw error;
    }
  }
  return channel;
}

export async function closeRabbitMQ() {
  if (connection) {
    await connection.close();
    connection = null;
    channel = null;
  }
}
