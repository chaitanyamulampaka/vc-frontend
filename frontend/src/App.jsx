import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Login           from "./auth/login_form";
import Register        from "./pages/Register";
import LandingPage     from "./pages/LandingPage";
import ProductList     from "./pages/ProductList";
import ProductDetail   from "./pages/ProductDetail";
import Cart            from "./pages/Cart";
import Checkout        from "./pages/Checkout";
import OrderSuccess    from "./pages/OrderSuccess";
import MyOrders        from "./pages/MyOrders";
import MyProfile       from "./pages/MyProfile";
import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard  from "./pages/AdminDashboard";

import PrivateRoute    from "./components/PrivateRoute";
import ProtectedRoute  from "./components/ProtectedRoute";
import Header          from "./components/Header";
import Footer          from "./components/Footer";

import OurStory from "./pages/Story";
/* ── With header + footer ── */
const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

/* ── No header / footer (auth & dashboards) ── */
const Bare = () => <Outlet />;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth — no chrome */}
        <Route element={<Bare />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboards — no chrome */}
        <Route element={<Bare />}>
          <Route
            path="/artist-dashboard"
            element={
              <ProtectedRoute allowedRoles={["artist"]}>
                <ArtistDashboard />
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
        </Route>

        {/* Main site — header + footer */}
        <Route element={<Layout />}>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/orders"        element={<MyOrders />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile"       element={<MyProfile />} />
          <Route path="/story"         element={<OurStory />} />

          <Route
            path="/products"
            element={<PrivateRoute><ProductList /></PrivateRoute>}
          />
          <Route
            path="/product/:id"
            element={<PrivateRoute><ProductDetail /></PrivateRoute>}
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;