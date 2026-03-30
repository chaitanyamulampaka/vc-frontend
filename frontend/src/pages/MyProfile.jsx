import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import instance from "../services/axiosInstance";
import "../styles/MyProfile.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const BASE_URL = "https://vc-backend-phpt.onrender.com";

const getImage = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    full_name: "", mobile: "", address_line: "",
    city: "", district: "", state: "", pincode: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, o, a] = await Promise.all([
          instance.get("/me/"),
          instance.get("/orders/my-orders/"),
          instance.get("/addresses/"),
        ]);
        setUser(u.data);
        setOrders(o.data || []);
        setAddresses(a.data || []);
      } catch (e) {
        console.error("Profile load error", e);
      }
    };
    loadData();
  }, []);

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0].Status === "Success") {
        const po = data[0].PostOffice[0];
        setNewAddress((prev) => ({ ...prev, city: po.Name, district: po.District, state: po.State }));
      } else alert("Invalid pincode");
    } catch (err) { console.error("Pincode fetch failed", err); }
  };

  const handleAddAddress = async () => {
    if (!newAddress.full_name || !newAddress.pincode || !newAddress.address_line) {
      alert("Please fill required fields"); return;
    }
    try {
      const res = await instance.post("/addresses/", newAddress);
      setAddresses([...addresses, res.data]);
      setShowAddressForm(false);
      setNewAddress({ full_name: "", mobile: "", address_line: "", city: "", district: "", state: "", pincode: "" });
    } catch { alert("Failed to add address"); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return <div className="mp-loading"><div className="mp-spinner" /></div>;

  const tabs = [
    { key: "overview",  label: "Overview" },
    { key: "addresses", label: "Addresses" },
    { key: "orders",    label: "Orders" },
  ];

  return (
    <div className="mp-root">
      <Header />
      <div className="mp-container">

        {/* SIDEBAR */}
        <aside className="mp-sidebar">
          <div className="mp-identity">
            <div className="mp-monogram">
              {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="mp-greeting">My account</p>
              <h3 className="mp-name">{user.first_name || user.username}</h3>
            </div>
          </div>

          <nav className="mp-nav">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                className={`mp-nav-item${activeTab === key ? " mp-nav-item--active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mp-sidebar-footer">
            <button className="mp-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="mp-main">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="mp-panel mp-fade">
              <div className="mp-panel-head">
                <h2 className="mp-panel-title">Overview</h2>
              </div>

              <div className="mp-metrics">
                {[
                  { value: orders.length,    label: "Orders" },
                  { value: addresses.length, label: "Addresses" },
                  { value: user.role || "Customer", label: "Account type", small: true },
                ].map(({ value, label, small }) => (
                  <div className="mp-metric" key={label}>
                    <span className={`mp-metric-val${small ? " mp-metric-val--sm" : ""}`}>{value}</span>
                    <span className="mp-metric-label">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mp-section">
                <div className="mp-field-row">
                  <div className="mp-field">
                    <label className="mp-label">Name</label>
                    <input className="mp-input" value={user.first_name || user.username} readOnly />
                  </div>
                  <div className="mp-field">
                    <label className="mp-label">Email address</label>
                    <input className="mp-input" value={user.email} readOnly />
                  </div>
                </div>
                <p className="mp-hint">To update your email or mobile number, please contact our support team.</p>
              </div>
            </div>
          )}

          {/* ── ADDRESSES ── */}
          {activeTab === "addresses" && (
            <div className="mp-panel mp-fade">
              <div className="mp-panel-head mp-panel-head--row">
                <h2 className="mp-panel-title">Addresses</h2>
                <button
                  className={`mp-action-btn${showAddressForm ? " mp-action-btn--cancel" : ""}`}
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  {showAddressForm ? "Cancel" : "+ Add new"}
                </button>
              </div>

              {showAddressForm && (
                <div className="mp-form mp-fade">
                  <div className="mp-form-grid">
                    <div className="mp-field">
                      <label className="mp-label">Full name</label>
                      <input className="mp-input" placeholder="Enter full name"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} />
                    </div>
                    <div className="mp-field">
                      <label className="mp-label">Mobile number</label>
                      <input className="mp-input" placeholder="10-digit number"
                        value={newAddress.mobile}
                        onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })} />
                    </div>
                    <div className="mp-field">
                      <label className="mp-label">Pincode</label>
                      <input className="mp-input" placeholder="6-digit pincode"
                        value={newAddress.pincode}
                        onChange={(e) => {
                          const v = e.target.value;
                          setNewAddress({ ...newAddress, pincode: v });
                          if (v.length === 6) fetchPincodeDetails(v);
                        }} />
                    </div>
                    <div className="mp-field">
                      <label className="mp-label">Locality / Town</label>
                      <input className="mp-input" placeholder="Auto-filled from pincode"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                    </div>
                    <div className="mp-field mp-field--full">
                      <label className="mp-label">Street address</label>
                      <textarea className="mp-input mp-textarea" placeholder="House no., area and street"
                        value={newAddress.address_line}
                        onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} />
                    </div>
                    <div className="mp-field">
                      <label className="mp-label">District</label>
                      <input className="mp-input mp-input--muted" value={newAddress.district} readOnly placeholder="Auto-filled" />
                    </div>
                    <div className="mp-field">
                      <label className="mp-label">State</label>
                      <input className="mp-input mp-input--muted" value={newAddress.state} readOnly placeholder="Auto-filled" />
                    </div>
                  </div>
                  <button className="mp-save-btn" onClick={handleAddAddress}>Save address</button>
                </div>
              )}

              <div className="mp-addr-list">
                {addresses.length === 0 && !showAddressForm && (
                  <p className="mp-empty">No saved addresses. Add one to get started.</p>
                )}
                {addresses.map((addr) => (
                  <div className="mp-addr-card" key={addr.id}>
                    <div className="mp-addr-head">
                      <span className="mp-addr-tag">Home</span>
                      <span className="mp-addr-name">{addr.full_name}</span>
                      <span className="mp-addr-phone">{addr.mobile}</span>
                    </div>
                    <p className="mp-addr-body">
                      {addr.address_line}, {addr.city}, {addr.district}, {addr.state} &mdash; {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="mp-panel mp-fade">
              <div className="mp-panel-head">
                <h2 className="mp-panel-title">Orders</h2>
                <span className="mp-count">{orders.length} total</span>
              </div>

              {orders.length === 0 ? (
                <div className="mp-empty-state">
                  <p>No orders placed yet.</p>
                </div>
              ) : (
                <div className="mp-orders">
                  {orders.map((order) => (
                    <div className="mp-order" key={order.id}>
                      <div className="mp-order-head">
                        <div className="mp-order-id">
                          <span className="mp-order-label">Order</span>
                          <span>#{order.id}</span>
                        </div>
                        <div className="mp-order-meta">
                          <span className="mp-order-date">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </span>
                          <span className={`mp-badge mp-badge--${order.status || "pending"}`}>
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mp-order-items">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="mp-order-item"
                            onClick={() => navigate(`/product/${item.product_id}`)}
                          >
                            <div className="mp-thumb">
                              <img
                                src={item.product_image
                                  ? getImage(item.product_image)
                                  : "https://via.placeholder.com/56"}
                                alt={item.product_name}
                              />
                            </div>
                            <div className="mp-item-info">
                              <p className="mp-item-name">{item.product_name}</p>
                              <p className="mp-item-qty">Qty: {item.quantity}</p>
                            </div>
                            <span className="mp-item-price">₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mp-order-foot">
                        {order.tracking_number && (
                          <span className="mp-tracking">Tracking: <strong>{order.tracking_number}</strong></span>
                        )}
                        <div className="mp-total">
                          <span className="mp-total-label">Order total</span>
                          <span className="mp-total-val">₹{order.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default MyProfile;