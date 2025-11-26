import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import cors from "@fastify/cors";
import { Server } from "socket.io";

// Importación de rutas
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import favoritesRoutes from "./routes/favorites.route.js";
import adminRoutes from "./routes/admin.route.js";
import ordersRoutes from "./routes/order.route.js";
import returnRoutes from "./routes/return.route.js";

// Crear Fastify
const fastify = Fastify({
  logger: true,
});

// Plugins
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

// Rutas
fastify.register(userRoutes);
fastify.register(productRoutes);
fastify.register(cartRoutes);
fastify.register(favoritesRoutes);
fastify.register(adminRoutes);
fastify.register(ordersRoutes);
fastify.register(returnRoutes);

// Decorate fastify instance so `io` can be attached later (must be before listen)
fastify.decorate("io", null);

// Attach `io` to requests at runtime. `fastify.io` will be set after the server starts.
fastify.addHook("onRequest", (req, reply, done) => {
  req.io = fastify.io;
  done();
});

export default fastify;