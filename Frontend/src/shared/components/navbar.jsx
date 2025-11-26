import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaBars,
  FaShoppingCart,
  FaHeart,
  FaUserCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DialogCart from "../../shop/components/DialogCart";
import DialogFavorites from "../../shop/components/DialogFavorites";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";

const PORT = import.meta.env.VITE_SERVER_PORT;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { favorites } = useFavorites();

  const ICON_SIZE = 22;

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:${PORT}/api/v1/users/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch {}
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const initials = (u) =>
    `${u?.name?.[0] ?? "U"}${u?.lastName?.[0] ?? ""}`.toUpperCase();

  const NavLink = ({ to, children }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`relative px-1.5 py-2 font-medium transition-all duration-200 ${
          active
            ? "text-red-700 after:scale-x-100"
            : "text-gray-700 hover:text-red-700"
        } after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:scale-x-0 after:bg-red-600 after:transition-transform after:origin-left hover:after:scale-x-100`}
      >
        {children}
      </Link>
    );
  };

  const cartCount = Array.isArray(cart) ? cart.length : 0;
  const favoritesCount = Array.isArray(favorites) ? favorites.length : 0;

  const IconButton = ({ onClick, children, label }) => (
    <button
      onClick={onClick}
      className="text-red-700 hover:text-red-800 relative focus-visible:ring-red-500 active:scale-[0.97] transition focus:outline-none focus-visible:ring-2 rounded-md p-1"
      aria-label={label}
    >
      {children}
    </button>
  );

  const Badge = ({ count }) =>
    count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] rounded-full grid place-items-center font-semibold px-1">
        {count}
      </span>
    );

  const UserDropdown = () => (
    <div
      className="absolute right-0 top-10 z-50 w-64 rounded-2xl border border-red-100 bg-white/95 backdrop-blur-xl shadow-xl ring-1 ring-black/5 animate-fade-in"
      ref={dropdownRef}
      role="menu"
    >
      <div className="px-4 py-3 border-b bg-red-50/60 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white grid place-items-center font-semibold shadow-sm">
            {initials(user)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        <Link
          to="/Profile"
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
          onClick={() => setDropdownOpen(false)}
        >
          <FaUserCog className="h-4 w-4" />
          Ver perfil
        </Link>
        <div className="my-1 h-px bg-gray-100" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <FaSignOutAlt className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  const AuthSection = () =>
    user ? (
      <div className="relative flex items-center justify-center" ref={dropdownRef}>
        <IconButton
          onClick={() => setDropdownOpen((v) => !v)}
          label="Abrir menú de usuario"
        >
          <FaUserCircle size={ICON_SIZE} />
        </IconButton>
        {dropdownOpen && <UserDropdown />}
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <Link
          to="/Login"
          className="px-4 py-1.5 text-sm font-semibold text-red-700 border border-red-600 hover:bg-red-600 hover:text-white rounded-full transition"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/Register"
          className="px-4 py-1.5 text-sm font-semibold text-red-700 border border-red-600 hover:bg-red-600 hover:text-white rounded-full transition"
        >
          Crear cuenta
        </Link>
      </div>
    );

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-red-100"
            : "bg-transparent backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/Home"
              className="text-red-700 font-extrabold text-2xl tracking-wide font-serif"
            >
              JFLOWG
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-7 text-[0.95rem] font-medium">
              <NavLink to="/Products">Catálogo</NavLink>
              <NavLink to="/About">Nosotros</NavLink>
              <NavLink to="/Blogs">Blog</NavLink>
              <NavLink to="/Contact">Contacto</NavLink>
            </div>

            {/* Icons desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <IconButton onClick={() => setIsFavoritesOpen(true)} label="Abrir favoritos">
                  <FaHeart size={ICON_SIZE} />
                  <Badge count={favoritesCount} />
                </IconButton>
              </div>
              <div className="relative">
                <IconButton onClick={() => setIsCartOpen(true)} label="Abrir carrito">
                  <FaShoppingCart size={ICON_SIZE} />
                  <Badge count={cartCount} />
                </IconButton>
              </div>
              {AuthSection()}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-red-700 hover:text-red-800 focus-visible:ring-red-500 focus:outline-none focus-visible:ring-2 rounded-md p-1"
              aria-label="Abrir menú"
            >
              <FaBars size={ICON_SIZE} />
            </button>
          </div>
        </div>
      </nav>

      {/* spacer */}
      <div className="h-[68px]" />

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer mobile */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-xs bg-white/90 backdrop-blur-xl border-l border-red-100 shadow-2xl md:hidden transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-red-100">
          <Link
            to="/Home"
            className="text-red-700 font-extrabold text-xl tracking-wide font-serif"
            onClick={() => setMobileOpen(false)}
          >
            JFLOWG
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md text-red-700 hover:bg-red-50 focus-visible:ring-red-500 focus:outline-none focus-visible:ring-2"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-1.5 text-gray-800">
          {["Products", "About", "Blogs", "Contact"].map((page) => (
            <Link
              key={page}
              to={`/${page}`}
              onClick={() => setMobileOpen(false)}
              className="block py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition"
            >
              {page === "Products"
                ? "Catálogo"
                : page === "About"
                ? "Nosotros"
                : page === "Blogs"
                ? "Blog"
                : "Contacto"}
            </Link>
          ))}

          <div className="my-3 h-px bg-gray-100" />

          <div className="flex items-center gap-4">
            <IconButton onClick={() => setIsFavoritesOpen(true)} label="Abrir favoritos">
              <FaHeart size={ICON_SIZE} />
              <Badge count={favoritesCount} />
            </IconButton>
            <IconButton onClick={() => setIsCartOpen(true)} label="Abrir carrito">
              <FaShoppingCart size={ICON_SIZE} />
              <Badge count={cartCount} />
            </IconButton>
          </div>

          <div className="pt-3">
            {!user ? (
              <div className="flex gap-3">
                <Link
                  to="/Login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-red-700 border border-red-600 hover:bg-red-600 hover:text-white rounded-full transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/Register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-red-700 border border-red-600 hover:bg-red-600 hover:text-white rounded-full transition"
                >
                  Crear cuenta
                </Link>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-red-100 overflow-hidden shadow-sm">
                <div className="bg-red-50 px-4 py-3 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-600 to-red-500 h-10 w-10 rounded-full text-white grid place-items-center font-semibold shadow-sm">
                    {initials(user)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/Profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-700 transition"
                >
                  <FaUserCog className="w-4 h-4" />
                  Mi cuenta
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 hover:text-red-700 transition"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <DialogFavorites
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
      <DialogCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
