import React from 'react';
import Navbar from '../../shared/components/navbar';
import Footer from '../../shared/components/Footer';

const blogs = [
    {
        title: "Tips de moda para verano",
        content: "Conoce cómo combinar prendas frescas y mantenerte con estilo en días calurosos."
    },
    {
        title: "Accesorios que marcan tendencia",
        content: "Descubre cuáles son los accesorios clave que no te pueden faltar este año."
    }
];

export default function Blogs() {
    return (
        <section className="py-10 bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mt-24 mx-auto px-4">
                <h2 className="text-4xl font-bold mb-6 text-center">Últimos Blogs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {blogs.map((blog, index) => (
                        <div key={index} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                            <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                            <p className="text-gray-600">{blog.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* <Footer /> */}
        </section>
    );
}