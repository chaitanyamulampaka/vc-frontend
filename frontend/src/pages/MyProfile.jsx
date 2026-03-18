import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import instance from "../services/axiosInstance";
import "../styles/MyProfile.css";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    // Initial data fetch
    const loadData = async () => {
       try {
         const [u, o, a] = await Promise.all([
           instance.get("/me/"),
           instance.get("/orders/my-orders/"),
           instance.get("/addresses/")
         ]);
         setUser(u.data);
         setOrderCount(o.data.length);
         setAddresses(a.data);
       } catch (e) { console.error("Profile load error", e); }
    };
    loadData();
  }, []);

  if (!user) return <div className="loader-v">Initializing...</div>;

  return (
    <div className="profile-page-root">
      <Header />
      
      <div className="container">
        <main className="profile-main-layout">
          
          {/* SIDEBAR */}
          <aside className="profile-sidebar-nav">
            <div className="profile-user-card">
              <div className="avatar-wrapper">
                <div className="avatar-inner">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="user-meta">
                <p>Hello,</p>
                <h3>{user.username}</h3>
              </div>
            </div>

            <nav style={{ padding: '10px 0' }}>
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span style={{ fontSize: '18px' }}>👤</span> Personal Information
              </button>
              <button 
                className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span style={{ fontSize: '18px' }}>📍</span> Manage Addresses
              </button>
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span style={{ fontSize: '18px' }}>📦</span> My Orders
              </button>
              <hr style={{ border: '0', borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />
              <button className="nav-link" style={{ color: '#ff6161' }}>
                <span style={{ fontSize: '18px' }}>🚪</span> Logout
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <section className="content-card">
            
            {activeTab === "overview" && (
              <>
                <div className="card-header-main">
                  <h2>Personal Information</h2>
                </div>
                
                <div className="stats-banner">
                  <div className="stat-item">
                    <span className="lbl">Total Orders</span>
                    <span className="val">{orderCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="lbl">Addresses</span>
                    <span className="val">{addresses.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="lbl">Account Type</span>
                    <span className="val" style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                      {user.role || 'Customer'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '10px 30px' }}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input className="modern-input" value={user.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input className="modern-input" value={user.mobile || "Not Linked"} readOnly />
                  </div>
                  <p style={{ fontSize: '12px', color: '#878787', marginTop: '40px' }}>
                    * To change your registered email or mobile, please contact support.
                  </p>
                </div>
              </>
            )}

            {activeTab === "addresses" && (
              <>
                <div className="card-header-main" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h2>Manage Addresses</h2>
                  <button className="btn-add-new" onClick={() => setShowAddressForm(!showAddressForm)}>
                    {showAddressForm ? "✕ Close" : "+ Add New Address"}
                  </button>
                </div>

                {showAddressForm && (
                   <div className="modern-form">
                      {/* Your form inputs here using className="modern-input" */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                        <input className="modern-input" placeholder="Full Name" />
                        <input className="modern-input" placeholder="10-digit Mobile" />
                      </div>
                      <textarea className="modern-input" style={{ marginTop: '15px', height: '80px' }} placeholder="Address (Area and Street)" />
                      <button className="btn-primary-fk" style={{ marginTop: '20px' }}>Save Address</button>
                   </div>
                )}

                <div className="address-grid">
                  {addresses.map(addr => (
                    <div className="address-card" key={addr.id}>
                      <span className="tag-home">HOME</span>
                      <span className="address-name">{addr.full_name} <strong>{addr.mobile}</strong></span>
                      <p className="address-details">
                        {addr.address_line}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

          </section>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;