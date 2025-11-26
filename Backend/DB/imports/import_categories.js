import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
console.log(uri);

const cliente = new MongoClient(uri);

const categorias = [
    {
        _id: new ObjectId("6878869799f4379a3467de26"),
        name: "Female",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878869799f4379a3467de27"),
        name: "Male",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
];



async function run() {
    try {
        await cliente.connect();
        const db = cliente.db('jflowg_db');
        const coleccion = db.collection('categories');

        await coleccion.insertMany(categorias);
        console.log('Datos importados correctamente');
    } catch (error) {
        console.error(error);
    } finally {
        await cliente.close();
    }
}

run();
