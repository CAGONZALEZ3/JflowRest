import { connect } from 'mongoose';
import fastify from './app.js';

const MONGO_URI = `${process.env.MONGODB_URI}/jflowg_db`
const PORT = process.env.PORT || 3001
// Run the server
const start = async () => {
  try {
    await connect(MONGO_URI);
    fastify.log.info('MongoDB connected successfully');
    await fastify.listen({ port: PORT });
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();