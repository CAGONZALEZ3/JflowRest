import { connect } from 'mongoose';
import fastify from './app.js';
import { Server } from 'socket.io';

const MONGO_URI = `${process.env.MONGODB_URI}/jflowg_db`
const PORT = process.env.PORT || 3001
// Run the server
const start = async () => {
  try {
    await connect(MONGO_URI);
    fastify.log.info('MongoDB connected successfully');
    // Start the HTTP server
    const address = await fastify.listen({ port: PORT });
    console.log(`Server running on ${address}`);

    // Attach Socket.IO to the underlying server now that it's listening
    const io = new Server(fastify.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
      },
    });

    // Expose io on the fastify instance so request hook can access it
    fastify.io = io;

    io.on('connection', (socket) => {
      console.log('🛰️ Cliente conectado:', socket.id);
      socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();