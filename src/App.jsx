import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login_form";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />

        {/* Product detail (can also protect if needed) */}
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductDetail />
            </PrivateRoute>
          }
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/artist-dashboard"
            element={
                <ProtectedRoute allowedRoles={["artist"]}>
                    <ArtistDashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/checkout"
            element={
                <ProtectedRoute allowedRoles={["customer"]}>
                    <Checkout />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin-dashboard"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                </ProtectedRoute>
            }
        />

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;