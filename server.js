import { connect } from 'mongoose';
import fastify from './app.js';
import { Server } from "socket.io";

const MONGO_URI = `${process.env.MONGODB_URI}/jflowg_db`
const PORT = process.env.PORT || 3001
// Run the server
const start = async () => {
  try {
    await connect(MONGO_URI);
    fastify.log.info('MongoDB connected successfully');
    await fastify.listen({ port: PORT,
                            host: "0.0.0.0", });
    console.log(`Server running on port ${PORT}`);
    const io = new Server(fastify.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      },
    });

    // 3️⃣ Socket events
    io.on("connection", (socket) => {
      console.log("🛰️ Cliente conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id);
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();