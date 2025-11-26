import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const cliente = new MongoClient(uri);

const femaleParentId = "6878869799f4379a3467de26", maleParentId = "6878869799f4379a3467de27";

const subCategorias = [
    {
        _id: new ObjectId("6878889965748ba432e1ab5c"),
        name: "Dresses",
        slug: "dresses",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab5d"),
        name: "Tops",
        slug: "tops",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab5e"),
        name: "Skirts",
        slug: "skirts",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab5f"),
        name: "Pants",
        slug: "pants",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab60"),
        name: "Jackets",
        slug: "jackets",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab61"),
        name: "Coats",
        slug: "coats",         // “tops”, para URL amigable
        parent_id: new ObjectId(femaleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab62"),
        name: "Shirts",
        slug: "shirts",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab63"),
        name: "Pants",
        slug: "pants",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab64"),
        name: "Suits",
        slug: "suits",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab65"),
        name: "T-shirts",
        slug: "t-shirts",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab66"),
        name: "Jackets",
        slug: "jackets",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("6878889965748ba432e1ab67"),
        name: "Coats",
        slug: "coats",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: new ObjectId("68788b6ea0e53931850a3922"),
        name: "Hats",
        slug: "hats",         // “tops”, para URL amigable
        parent_id: new ObjectId(maleParentId),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
];

async function run() {
    try {
        await cliente.connect();
        const db = cliente.db('jflowg_db');
        const coleccion = db.collection('sub_categories');

        await coleccion.insertMany(subCategorias);
        console.log('Datos importados correctamente');
    } catch (error) {
        console.error(error);
    } finally {
        await cliente.close();
    }
}

run();
