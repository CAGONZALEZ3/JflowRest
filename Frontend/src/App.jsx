import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth
import Login from "./auth/pages/Login";
import Register from "./auth/pages/Register";
import ForgotPassword from "./auth/pages/ForgotPassword";

// Shop
import Home from "./shop/pages/Home";
import Products from "./shop/pages/Products";
import Colecction from "./shop/pages/colecction";
import ProductDetail from "./shop/pages/ProductDetail";
import Cart from "./shop/pages/Cart";

// User
import Profile from "./user/pages/Profile";
import EditUserProfile from "./user/pages/EditProfile";
import Orders from "./user/pages/Orders";
import Returns from "./user/pages/Returns";
import Shipping from "./user/pages/Shipping";
import ChangePassword from "./user/pages/ChangePassword";

// Admin
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminPayments from "./admin/pages/AdminPayments";
import GestionDevoucion from "./admin/pages/GestionDevoucion";
import GestionUser from "./admin/pages/GestionUser";
import GestionPedidos from "./admin/pages/GestionPedidos";
import ProductCrud from "./admin/pages/ProductCrud";
import CreateProduct from "./admin/pages/CreateProduct";
import UpdateProduct from "./admin/pages/UpdateProduct";
import UpdateUser from "./admin/pages/UpdateUser";
import CreateUser from "./admin/pages/CreateUser";

// About / Info
import AboutUs from "./about/pages/AboutUs";
import ContactUs from "./about/pages/ContactUs";
import Blogs from "./about/pages/Blogs";

function getStoredUser() {
  const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function isAdmin(user) {
  if (!user || user.role == null) return false;
  const roleString = String(user.role);
  return roleString === "100" || /^1\d{2}$/.test(roleString);
}

function ProtectedRoute({ isAllowed, children }) {
  if (!isAllowed) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}

function App() {
  const user = getStoredUser();

  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Colecction" element={<Colecction />} />
            <Route path="/Products/:id" element={<ProductDetail />} />
            <Route path="/About" element={<AboutUs />} />
            <Route path="/Contact" element={<ContactUs />} />
            <Route path="/Blogs" element={<Blogs />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User routes */}
            <Route
              path="/Profile"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Edit-Profile"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <EditUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Orders"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Returns"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <Returns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Shipping"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <Shipping />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ChangePassword"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Cart"
              element={
                <ProtectedRoute isAllowed={Boolean(user)}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <AdminDashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-Devolution"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <GestionDevoucion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-User"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <GestionUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Product-Crud"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <ProductCrud />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Products/Create"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Products/Update"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <UpdateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-Pedidos"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <GestionPedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Users/Update"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <UpdateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Users/Create"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Admin-Payments"
              element={
                <ProtectedRoute isAllowed={isAdmin(user)}>
                  <AdminPayments />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/Home" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            pauseOnFocusLoss
          />
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
