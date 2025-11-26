import { ObjectId } from 'mongodb';
import { Cart } from '../models/cart.model.js';
import { Order } from '../models/order.model.js';
import { ProductVariant } from '../models/productVariant.model.js';
import { logAudit } from '../utils/audit.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK)

const cartController = {

    getCart: async (request, reply) => {
        const user = request.session.user;
        if (!user) {
            return { item: [] }
        }
        try {
            const cart = await Cart.findOne({ user_id: user.id })
                .populate('user_id', ['name', 'lastName', 'email'])
                .populate('items.product_id')
                .populate('items.product_variant_id');
            return cart
        } catch (err) {
            reply.status(500).send('Error al encontrar carrito', err);
        }
    },

    updateCart: async (request, reply) => {
        const { id } = request.session.user,
            newItems = request.body;
        try {
            const { items } = await Cart.findOne({ user_id: id })
            const itemExist = items.find(i => i.product_variant_id.toString() === newItems.items.product_variant_id);
            
            if (itemExist) {
                console.log('ITEM ENCONTRADO!');
                const updatedItems = items.map(i => i.product_variant_id.toString() === newItems.items.product_variant_id ? newItems.items : i)

                const updatedUserCart = await Cart.findOneAndUpdate({ user_id: id },
                    { $set: { items: updatedItems } },
                    {
                        new: true,
                        runValidators: true
                    })
                if (!updatedUserCart) return reply.code(404);

            } else {
                const newCart = [...newItems.items, ...items];

                const updatedUserCart = await Cart.findOneAndUpdate({ user_id: id },
                    { $set: { items: newCart } },
                    {
                        new: true,
                        runValidators: true
                    })
                if (!updatedUserCart) return reply.code(404);
            }

            await logAudit({ req: request, action: 'cart_updated', entityType: 'cart', entityId: id, meta: { product_variant_id: newItems?.items?.product_variant_id } });
            reply.code(200).send("Se ha actualizado el carrito")
        } catch (err) {
            reply.status(500).send('Error al actializar carrito', err);
        }
    },

    deleteCartItem: async (request, reply) => {
        const { id } = request.session.user,
            item = request.body;
        try {
            const cart = await Cart.findOneAndUpdate({ user_id: id },
                { $pull: { items: item } },
                {
                    new: true,
                    runValidators: true
                }
            );
            await logAudit({ req: request, action: 'cart_item_deleted', entityType: 'cart', entityId: id, meta: item });
            reply.code(200).send("Item eliminado")
        } catch (err) {
            reply.status(500).send('Error al eliminar producto')
        }
    },

    // controllers/order.controller.js o cart.controller.js

checkout: async (request, reply) => {
  try {
    const domainURL = `http://localhost:${process.env.PORT}`;
    const { items } = request.body;

    if (!items) return reply.status(404).send({ error: "Ha ocurrido un error" });

    // 🧾 Crear estructura de items para Stripe
    const cartItems = items.map((i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: i.product_id.name,
        },
        unit_amount: Math.round(i.product_variant_id.price * 100),
      },
      quantity: i.quantity,
    }));

    // 🧠 Crear sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems,
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['US','ES','MX','AR','CO','CL','PE'] },
      success_url: `${domainURL}/api/v1/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/api/v1/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    reply.send({ url: session.url });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: "Error iniciando compra" });
  }
},

success: async (request, reply) => {
  try {
    const user = request.session.user;
    if (!user) return reply.status(401).send({ error: "Usuario no autenticado" });

    // ✅ Recuperar la sesión con los line_items expandidos
    const session = await stripe.checkout.sessions.retrieve(
      request.query.session_id,
      { expand: ["line_items"] }
    );

    // ✅ Obtener los line_items reales desde Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(
      request.query.session_id,
      { limit: 100 }
    );

    const products = lineItems.data.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.amount_total / 100,
    }));

    // 📦 Crear pedido exitoso
    const order = await Order.create({
      checkout_session: session,
      user_id: user.id,
      status: "succeeded",
      products,
      amount: session?.amount_total ? session.amount_total / 100 : 0,
      address: [
        session?.customer_details?.address?.line1,
        session?.customer_details?.address?.city,
      ]
        .filter(Boolean)
        .join(", "),
    });

    await logAudit({
      req: request,
      action: "order_created",
      entityType: "order",
      entityId: order._id,
      meta: { amount_total: session.amount_total },
    });

    // Vaciar carrito
    await Cart.findOneAndUpdate({ user_id: user.id }, { $set: { items: [] } });

    reply
      .type("text/html")
      .send(
        `<h2 style="font-family:sans-serif; color:#16a34a;">¡Compra exitosa!</h2>
         <p style="font-family:sans-serif;">Tu pedido ha sido registrado correctamente.</p>
         <a href="http://localhost:${process.env.CLIENT_PORT}"
            style="display:inline-block;margin-top:10px;background-color:#2563eb;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;">
            Volver a la tienda
         </a>`
      );
  } catch (err) {
    console.error("Error en success:", err);
    reply.status(500).send({ error: "Error al registrar pedido exitoso" });
  }
},

cancel: async (request, reply) => {
  try {
    const user = request.session.user;
    if (!user)
      return reply.status(401).send({ error: "Usuario no autenticado" });

    // ✅ Recuperar la sesión con los line_items expandidos
    const session = await stripe.checkout.sessions.retrieve(
      request.query.session_id,
      { expand: ["line_items"] }
    );

    // ✅ Obtener los line_items (aunque sea cancelado)
    const lineItems = await stripe.checkout.sessions.listLineItems(
      request.query.session_id,
      { limit: 100 }
    );

    const products = lineItems.data.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.amount_total / 100,
    }));

    // 📦 Crear pedido cancelado
    const order = await Order.create({
      checkout_session: session,
      user_id: user.id,
      status: "cancelled",
      products,
      amount: session?.amount_total ? session.amount_total / 100 : 0,
      address: [
        session?.customer_details?.address?.line1,
        session?.customer_details?.address?.city,
      ]
        .filter(Boolean)
        .join(", "),
    });

    await logAudit({
      req: request,
      action: "order_cancelled",
      entityType: "order",
      entityId: order._id,
      meta: { amount_total: session?.amount_total },
    });

    reply
      .type("text/html")
      .send(
        `<h2 style="font-family:sans-serif; color:#e11d48;">Compra cancelada</h2>
         <p style="font-family:sans-serif;">Tu pedido fue cancelado correctamente.</p>
         <a href="http://localhost:${process.env.CLIENT_PORT}"
            style="display:inline-block;margin-top:10px;background-color:#2563eb;color:#fff;padding:8px 14px;border-radius:6px;text-decoration:none;">
            Volver a la tienda
         </a>`
      );
  } catch (err) {
    console.error("Error en cancel:", err);
    reply.status(500).send({ error: "Error al registrar pedido cancelado" });
  }
},


};
export default cartController;
