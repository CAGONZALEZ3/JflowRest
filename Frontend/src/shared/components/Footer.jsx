import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer({ bw = false }) {
  return (
    <footer className={`${bw ? "bg-white text-black" : "bg-gray-100 text-rose-900"} py-20 px-6`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className={`font-bold text-lg mb-2 ${bw ? "text-black" : "text-rose-950"}`}>Logo</h4>
          <p className="text-sm">Copyright © 2024, Jflowg. Todos los derechos reservados.</p>
        </div>
        <div>
          <h5 className={`font-semibold mb-2 ${bw ? "text-black" : "text-rose-950"}`}>Servicios</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}>Home</a></li>
            <li><a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}>Artículos</a></li>
          </ul>
        </div>
        <div>
          <h5 className={`font-semibold mb-2 ${bw ? "text-black" : "text-rose-950"}`}>Sobre</h5>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}>Dev Team</a></li>
            <li><a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}>Ayuda</a></li>
            <li><a href="/About" className={`${bw ? "hover:text-black" : "hover:text-white"}`}>Nosotros</a></li>
          </ul>
        </div>
        <div className={`flex md:justify-end items-start space-x-4 ${bw ? "text-black" : "text-rose-900"}`}>
          <a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}><FaFacebookF /></a>
          <a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}><FaTwitter /></a>
          <a href="#" className={`${bw ? "hover:text-black" : "hover:text-white"}`}><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

