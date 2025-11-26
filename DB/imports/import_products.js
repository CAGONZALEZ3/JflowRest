import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const cliente = new MongoClient(uri);

const productos = [
  {
    _id: new ObjectId("68788c8c92d3cbc746476f5d"),
    name: "Printed Blouse",
    description: "Blusa Estampada, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab5c"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a7e"),
      new ObjectId("68788f0eb0e883b9b85e7a7f"),
    ],
    created_at: "2025-07-16T20:02:45.183544",
    updated_at: "2025-07-16T20:02:45.183561"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f5e"),
    name: "Crop Top",
    description: "Crop Top, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab5d"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a80"),
      new ObjectId("68788f0eb0e883b9b85e7a81"),
    ],
    created_at: "2025-07-16T20:02:45.184654",
    updated_at: "2025-07-16T20:02:45.184657"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f5f"),
    name: "Basic T-Shirt",
    description: "Camiseta Básica, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab65"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a82"),
      new ObjectId("68788f0eb0e883b9b85e7a83"),
    ],
    created_at: "2025-07-16T20:02:45.184825",
    updated_at: "2025-07-16T20:02:45.184828"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f60"),
    name: "Sports Shorts",
    description: "Short Deportivo, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab63"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a84"),
      new ObjectId("68788f0eb0e883b9b85e7a85"),
    ],
    created_at: "2025-07-16T20:02:45.185515",
    updated_at: "2025-07-16T20:02:45.185519"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f61"),
    name: "Skinny Jeans",
    description: "Jeans Skinny, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab5f"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a86"),
      new ObjectId("68788f0eb0e883b9b85e7a87"),
    ],
    created_at: "2025-07-16T20:02:45.185653",
    updated_at: "2025-07-16T20:02:45.185657"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f62"),
    name: "Embroidered Cap",
    description: "Gorra Bordada, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("68788b6ea0e53931850a3922"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a88"),
      new ObjectId("68788f0eb0e883b9b85e7a89"),
    ],
    created_at: "2025-07-16T20:02:45.186669",
    updated_at: "2025-07-16T20:02:45.186675"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f63"),
    name: "Denim Jacket",
    description: "Chaqueta de Mezclilla, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab60"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a8a"),
      new ObjectId("68788f0eb0e883b9b85e7a8b"),
    ],
    created_at: "2025-07-16T20:02:45.186851",
    updated_at: "2025-07-16T20:02:45.186854"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f64"),
    name: "Cargo Pants",
    description: "Pantalón Cargo, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab63"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a8c"),
      new ObjectId("68788f0eb0e883b9b85e7a8d"),
    ],
    created_at: "2025-07-16T20:02:45.188026",
    updated_at: "2025-07-16T20:02:45.188029"
  },
  {
    _id: new ObjectId("68788c8c92d3cbc746476f65"),
    name: "Sports Top",
    description: "Top Deportivo, ideal para cualquier ocasión.",
    sub_category_id: new ObjectId("6878889965748ba432e1ab5d"),
    variants: [
      new ObjectId("68788f0eb0e883b9b85e7a8e"),
      new ObjectId("68788f0eb0e883b9b85e7a8f"),
    ],
    created_at: "2025-07-16T20:02:45.188099",
    updated_at: "2025-07-16T20:02:45.188102"
  },
];

async function run() {
  try {
    await cliente.connect();
    const db = cliente.db('jflowg_db');
    const coleccion = db.collection('products');

    await coleccion.insertMany(productos);
    console.log('Datos importados correctamente');
  } catch (error) {
    console.error(error);
  } finally {
    await cliente.close();
  }
}

run();
