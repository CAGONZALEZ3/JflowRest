import CardProduct from "../components/CardProduct";

function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center text-gray-600">
        <p>No hay productos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-10
        justify-items-center
      "
    >
      {products.map((product) => (
        <CardProduct key={product._id} {...product} showPrice={true} />
      ))}
    </div>
  );
}

export default ProductGrid;
