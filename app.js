import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import cors from "@fastify/cors";


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

  // 4️⃣ Inject io into requests
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

// 🚀 Inicializar servidor
const start = async () => {
  try {
    const PORT = process.env.PORT || 3001;

    // 1️⃣ Start Fastify first
    /* const address = await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log("🚀 Fastify corriendo en:", address); */

    // 2️⃣ Attach Socket.io AFTER fastify.listen
    

    

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;