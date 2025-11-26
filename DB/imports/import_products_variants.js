import { MongoClient, ObjectId } from "mongodb";

const uri = 'mongodb://localhost:27017';
const cliente = new MongoClient(uri);

const variantes = [
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a7e"),
        sku: "PRBLO-RED-S",
        color: "red",
        size: "S",
        price: 25.5,
        stock: 44,
        images: [
            "https://www-s.mlo.me/upen/v/2019/201912/20191220/201912201735544391794.jpg"
        ],
        created_at: "2025-07-17T06:56:02.176Z",
        updatedAt: new Date("2025-07-30T21:14:19.772Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a7f"),
        sku: "PRBLO-BLUE-M",
        color: "blue",
        size: "M",
        price: 25.99,
        stock: 30,
        images: [
            "https://ml.thcdn.com/productimg/381/533/14476311-3355037196199952.jpg",
            "https://ml.thcdn.com/productimg/381/533/14476311-7985037190503726.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:14:19.875Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a80"),
        sku: "CROPT-BLACK-XS",
        color: "black",
        size: "XS",
        price: 19.99,
        stock: 60,
        images: [
            "https://cdn-img.prettylittlething.com/5/5/7/1/5571cbc41674911290794d2695bdd68454d885cf_cnj6311_1.jpg",
            "https://cdn-img.prettylittlething.com/f/e/8/6/fe860186eaba5528e051cd8581aae544520a509c_cnj6311_4.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:27:00.089Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a81"),
        sku: "CROPT-WHITE-S",
        color: "white",
        size: "S",
        price: 19.99,
        stock: 75,
        images: [
            "https://cdn-img.prettylittlething.com/9/e/5/5/9e5526e729c89e88efb89bac0a6517aacd5d134b_cnd5650_3.jpg",
            "https://cdn-img.prettylittlething.com/8/7/f/8/87f84978da464e0c71f9fdead1af0b26c2dde732_cnd5650_4.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:27:00.096Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a82"),
        sku: "BATSH-GREY-L",
        color: "grey",
        size: "L",
        price: 15.5,
        stock: 120,
        images: [
            "https://img01.ztat.net/article/spp-media-p1/c6f0b7c3ab5346e7bbb3d93046a94d0b/32beebb1cc404b9184cd745f97df35a1.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:32:17.870Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a83"),
        sku: "BATSH-BLACK-M",
        color: "black",
        size: "M",
        price: 15.5,
        stock: 150,
        images: [
            "https://img01.ztat.net/article/spp-media-p1/2e622df62b0f47a6af603b12ea22f774/a7f5f7569123497b8a57bcb3c27446e7.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:32:17.879Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a84"),
        sku: "SPSHO-BLACK-M",
        color: "black",
        size: "M",
        price: 29.99,
        stock: 50,
        images: [
            "https://i.pinimg.com/originals/92/18/55/9218550f68729997aae385cc1d64f312.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:40:30.720Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a85"),
        sku: "SPSHO-GREY-L",
        color: "grey",
        size: "L",
        price: 29.99,
        stock: 40,
        images: [
            "https://i.pinimg.com/originals/ea/7c/ff/ea7cff42c69fc0222715d9c432e4c78f.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:40:30.769Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a86"),
        sku: "JEANS-BLUE-30",
        color: "blue",
        size: "30",
        price: 49.95,
        stock: 80,
        images: [
            "https://www-s.mlo.me/upen/v/2021/202103/20210322/202103221506281024481.jpg",
            "https://www-s.mlo.me/upen/v/2021/202103/20210322/202103221506271922818.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:41:46.317Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a87"),
        sku: "JEANS-BLACK-32",
        color: "black",
        size: "32",
        price: 49.95,
        stock: 70,
        images: [
            "https://oldnavy.gap.com/webcontent/0050/704/839/cn50704839.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:41:46.325Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a88"),
        sku: "EMCAP-BLACK-U",
        color: "black",
        size: "unique",
        price: 22,
        stock: 100,
        images: [
            "https://sc02.alicdn.com/kf/H88f4ed727e354b6095f80455d8141291q/238785849/H88f4ed727e354b6095f80455d8141291q.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:43:40.254Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a89"),
        sku: "EMCAP-WHITE-U",
        color: "white",
        size: "unique",
        price: 22,
        stock: 90,
        images: [
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.Ra0WxSkNe1XHg9ZpyETaxgHaHa%3Fr%3D0%26pid"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:43:40.261Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8a"),
        sku: "DEJAC-BLUE-M",
        color: "blue",
        size: "M",
        price: 65,
        stock: 35,
        images: [
            "https://i5.walmartimages.com/seo/Male-Denim-Jacket-Autumn-Ruffian-Vintage-Wash-Cargo-Pocket-Jacket-Denim-Top_d1e867de-3aa6-42b0-abef-f69f9334140e.589dba1413a792deb61383aa6898146a.jpeg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:45:38.556Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8b"),
        sku: "DEJAC-BLACK-L",
        color: "black",
        size: "L",
        price: 65,
        stock: 25,
        images: [
            "https://i.pinimg.com/originals/57/50/d9/5750d988963485b5bced0b88be9dec32.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:45:38.565Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8c"),
        sku: "CAPAN-GREEN-32",
        color: "green",
        size: "32",
        price: 55.75,
        stock: 65,
        images: [
            "https://i.pinimg.com/736x/99/1e/53/991e5308edd6ae49a5fcefa0442e7d0d--mens-cargo-pants-olive-green.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:54:26.971Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8d"),
        sku: "CAPAN-BEIGE-34",
        color: "beige",
        size: "34",
        price: 55.75,
        stock: 55,
        images: [
            "https://i.pinimg.com/originals/b6/c7/68/b6c768923484dbcc8206ac6d6d2e4d05.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:54:26.977Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8e"),
        sku: "SPTOP-PINK-S",
        color: "pink",
        size: "S",
        price: 24.5,
        stock: 85,
        images: [
            "https://i5.walmartimages.com/asr/365d628f-60c5-4730-8c09-329dbbb3a230.c858735886772c42a6dbf7626ea1669f.jpeg",
            "https://i5.walmartimages.com/asr/40227198-1e09-4274-99ff-1578de84ff81.af666cbb051beb39fe97ed6cd3fe3fe8.jpeg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:49:55.692Z")
    },
    {
        _id: new ObjectId("68788f0eb0e883b9b85e7a8f"),
        sku: "SPTOP-BLACK-M",
        color: "black",
        size: "M",
        price: 24.5,
        stock: 95,
        images: [
            "https://cdn.shopify.com/s/files/1/0156/6146/files/SweatSeamlessLonglineBraBlack-B4A5B-BBBB-0573.54_d5d64b17-8a90-4032-b109-e6479d123e3d_1920x.jpg",
            "https://cdn.shopify.com/s/files/1/0156/6146/files/SweatSeamlessLonglineBraBlack-B4A5B-BBBB-0569.53_dbb78cea-2cef-4c34-9d4e-7ab093299972_1920x.jpg"
        ],
        created_at: "2025-07-17T06:56:02.177Z",
        updatedAt: new Date("2025-07-30T21:49:55.700Z")
    },
    {
        _id: new ObjectId("688a9c07de76f3c6fb2d7a7b"),
        sku: "HEAVY-BLAC-M",
        color: "black",
        size: "M",
        price: 14.99,
        stock: 50,
        images: [
            "https://i.pinimg.com/originals/38/4f/fc/384ffce578eb734612986de56755abc7.jpg"
        ],
        __v: 0,
        createdAt: new Date("2025-07-30T22:26:15.200Z"),
        updatedAt: new Date("2025-07-30T22:26:15.200Z")
    }
];

async function run() {
    try {
        await cliente.connect();
        const db = cliente.db('jflowg_db');
        const coleccion = db.collection('products_variants');

        await coleccion.insertMany(variantes);
        console.log('Datos importados correctamente');
    } catch (error) {
        console.error(error);
    } finally {
        await cliente.close();
    }
}

run();
