import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import cors from "@fastify/cors";
import { createServer } from "http";
import { Server } from "socket.io";

// Importación de rutas
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import favoritesRoutes from "./routes/favorites.route.js";
import adminRoutes from "./routes/admin.route.js";
import ordersRoutes from "./routes/order.route.js";
import returnRoutes from "./routes/return.route.js";

// Inicialización de Fastify
const fastify = Fastify({
  logger: true,
});

// Crear servidor HTTP (necesario para usar Socket.io)
const httpServer = createServer(fastify.server);

// Inicializar Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Evento de conexión
io.on("connection", (socket) => {
  console.log("🛰️ Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Middleware para inyectar io en las requests (para emitir eventos desde controladores)
fastify.decorateRequest("io", null);
fastify.addHook("onRequest", (req, reply, done) => {
  req.io = io;
  done();
});

// Plugins
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false, // true solo en producción (HTTPS)
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  },
});

fastify.register(cors, {
  origin: "http://localhost:5173", // frontend local
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

// 🚀 Inicializar servidor
const start = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    await fastify.ready(); // asegura que Fastify cargue todo antes de iniciar
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
