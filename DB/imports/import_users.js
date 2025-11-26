import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const cliente = new MongoClient(uri);

const users = [
    {
        name: "César",
        lastName: "Bernal",
        email: "example.bernal@email.com",
        password: "$2b$12$6jw517sPKYngRD3R2Dt7huYxVu96GOZOUKNbb9IDJuVOSGOlCjhR6",
        phone_number: "",
        birth_date: {
            $date: ""
        },
        gender: "",
        address: {
            country: "",
            postal_code: "",
            state: "",
            street: ""
        },
        role: 100,
        createdAt: "2025-07-16T16:55:59.262Z",
        updatedAt: "2025-07-16T16:55:59.262Z"
    },
    {
        name: "César",
        lastName: "Restrepo",
        email: "example.rest@email.com",
        password: "$2b$12$6jw517sPKYngRD3R2Dt7huYxVu96GOZOUKNbb9IDJuVOSGOlCjhR6",
        phone_number: "",
        birth_date: {
            $date: ""
        },
        gender: "",
        address: {
            country: "",
            postal_code: "",
            state: "",
            street: ""
        },
        role: 100,
        createdAt: "2025-07-16T16:55:59.262Z",
        updatedAt: "2025-07-16T16:55:59.262Z"
    },
    {
        name: "Angelis",
        lastName: "Linares",
        email: "example.li@email.com",
        password: "$2b$12$6jw517sPKYngRD3R2Dt7huYxVu96GOZOUKNbb9IDJuVOSGOlCjhR6",
        phone_number: "",
        birth_date: {
            $date: ""
        },
        gender: "",
        address: {
            country: "",
            postal_code: "",
            state: "",
            street: ""
        },
        role: 100,
        createdAt: "2025-07-16T16:55:59.262Z",
        updatedAt: "2025-07-16T16:55:59.262Z"
    }
];

async function run() {
    try {
        await cliente.connect();
        const db = cliente.db('jflowg_db');
        const coleccion = db.collection('users');

        await coleccion.insertMany(users);
        console.log('Datos importados correctamente');
    } catch (error) {
        console.error(error);
    } finally {
        await cliente.close();
    }
}

run();
