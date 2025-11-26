import React, { useMemo } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../shared/components/navbar";
import Footer from "../../shared/components/Footer";
import { Trash2, Plus, Minus, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { checkout } from "../../services/paymentService";

export default function Cart() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.product_variant_id?.price || 0) * item.quantity, 0),
    [cart]
  );

  const shipping = cart.length ? 9.99 : 0;
  const taxes = cart.length ? 14.0 : 0;
  const total = subtotal + shipping + taxes;

  const formatCurrency = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const checkoutSession = async () => {
    const res = await checkout({ items: cart });
    window.location.href = res;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero / Steps */}
      <section className="pt-28 md:pt-32 border-b border-red-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-red-600">Tu Carrito</span> de compras
              </h1>
              <p className="text-sm text-gray-500 mt-1">Revisa tus productos antes de continuar al pago.</p>
            </div>

            {/* Stepper */}
            <ol className="flex items-center gap-4 text-xs md:text-sm font-medium">
              <li className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white grid place-items-center">✓</span>
                <span>Carrito</span>
              </li>
              <div className="h-px w-6 md:w-10 bg-red-200" />
              <li className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full border-2 border-red-600 text-red-600 grid place-items-center">2</span>
                <span>Pago</span>
              </li>
              <div className="h-px w-6 md:w-10 bg-gray-200" />
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 grid place-items-center">3</span>
                <span>Confirmación</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {cart.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50">
              <CartIcon className="h-7 w-7 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
            <p className="mt-1 text-sm text-gray-500">Agrega productos para comenzar tu compra.</p>
            <button
              onClick={() => (window.location.href = "/Products")}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Explorar productos
            </button>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, i) => {
                const variant = item.product_variant_id;
                const product = item.product_id;
                const price = variant?.price || 0;
                const lineTotal = price * item.quantity;
                const image = variant?.images?.[0] || "https://cataas.com/cat";
                return (
                  <article
                    key={`${variant?._id || i}-${item.quantity}`}
                    className="group rounded-2xl border border-red-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={image}
                        alt={product?.name || "Producto"}
                        className="h-24 w-24 rounded-xl object-cover ring-1 ring-red-100"
                        loading="lazy"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
                              {product?.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                              Talla: {variant?.size} {variant?.color ? `• Color: ${variant.color}` : ""}
                            </p>
                          </div>
                          <p className="text-red-600 font-semibold whitespace-nowrap">${formatCurrency(price)}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="inline-flex items-center rounded-full border border-gray-200 overflow-hidden">
                            <button
                              aria-label="Disminuir cantidad"
                              onClick={() =>
                                decreaseQuantity({
                                  id: variant?._id,
                                  product_id: product?._id,
                                  product_variant_id: variant?._id,
                                  quantity: item.quantity,
                                })
                              }
                              className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 text-sm font-semibold tabular-nums">{item.quantity}</span>
                            <button
                              aria-label="Aumentar cantidad"
                              onClick={() =>
                                increaseQuantity({
                                  id: variant?._id,
                                  product_id: product?._id,
                                  product_variant_id: variant?._id,
                                  quantity: item.quantity,
                                })
                              }
                              className="p-2 hover:bg-red-50 text-gray-700 hover:text-red-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                              ${formatCurrency(lineTotal)}
                            </p>
                            <button
                              aria-label="Eliminar del carrito"
                              onClick={() =>
                                removeFromCart({
                                  product_id: product?._id,
                                  product_variant_id: variant?._id,
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-gray-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline text-xs">Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <button
                onClick={() => (window.location.href = "/Products")}
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
              >
                <span className="text-lg">←</span> Seguir comprando
              </button>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-4">
                <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">Resumen</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <Row label="Subtotal" value={`$${formatCurrency(subtotal)}`} />
                    <Row label="Envío" value={shipping ? `$${formatCurrency(shipping)}` : "$0.00"} />
                    <Row label="Impuestos" value={taxes ? `$${formatCurrency(taxes)}` : "$0.00"} />
                  </div>
                  <div className="my-4 h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-lg font-bold text-red-700">${formatCurrency(total)}</span>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="coupon" className="sr-only">Código promocional</label>
                    <input
                      id="coupon"
                      type="text"
                      placeholder="Código promocional"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <button
                      className="mt-2 w-full rounded-xl border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Aplicar
                    </button>
                  </div>

                  <button
                    onClick={checkoutSession}
                    className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Proceder al pago
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500">
                    <CreditCard className="h-4 w-4" />
                    <span>VISA</span>
                    <span>Mastercard</span>
                    <span>Apple Pay</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Badge icon={ShieldCheck} title="Pago seguro" subtitle="Cifrado y protección" />
                  <Badge icon={Truck} title="Envío rápido" subtitle="24–48 horas" />
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-gray-700">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Badge({ icon: Icon, title, subtitle }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}
