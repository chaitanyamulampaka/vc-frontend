import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

const BASE_URL = "https://vc-backend-phpt.onrender.com";

const getImage = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

/* ---------------- Razorpay Loader ---------------- */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const StepIndicator = ({ current }) => {
  const steps = ["Address", "Shipping", "Payment"];
  return (
    <div className="step-indicator">
      {steps.map((step, i) => (
        <div key={step} className={`step ${i + 1 <= current ? "active" : ""} ${i + 1 < current ? "done" : ""}`}>
          <div className="step-circle">
            {i + 1 < current ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <span className="step-label">{step}</span>
          {i < steps.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
};

function Checkout() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);

  const [newAddress, setNewAddress] = useState({
    full_name: "",
    mobile: "",
    address_line: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const fetchPincodeDetails = async (pincode) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setNewAddress((prev) => ({
          ...prev,
          city: postOffice.Name,
          district: postOffice.District,
          state: postOffice.State,
        }));
      } else {
        alert("Invalid Pincode");
      }
    } catch (err) {
      console.error("Pincode fetch failed", err);
    }
  };

  useEffect(() => { fetchAddresses(); fetchCart(); }, []);

  const fetchAddresses = async () => {
    const res = await instance.get("/addresses/");
    setAddresses(res.data);
    if (res.data.length > 0) setSelectedAddress(res.data[0]);
  };

  const fetchCart = async () => {
    const res = await instance.get("/cart/");
    setCart(res.data);
  };

  useEffect(() => {
    if (selectedAddress?.pincode && paymentMode) {
      fetchCouriers(selectedAddress.pincode, paymentMode);
    }
  }, [selectedAddress, paymentMode]);

  const fetchCouriers = async (pincode, paymentMode) => {
    const res = await instance.get(
      `orders/shipping/options/?delivery_pincode=${pincode}&payment_mode=${paymentMode}`
    );
    const sorted = res.data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setCouriers(sorted);
  };

  useEffect(() => {
    setShippingCost(selectedCourier ? parseFloat(selectedCourier.rate || 0) : 0);
  }, [selectedCourier]);

  const handleAddAddress = async () => {
    try {
      const res = await instance.post("/addresses/", newAddress);
      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data);
      setShowAddressForm(false);
      setNewAddress({ full_name: "", mobile: "", address_line: "", city: "", district: "", state: "", pincode: "" });
    } catch (err) {
      alert("Failed to add address");
    }
  };

  const getSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + parseFloat(item.product_price) * item.quantity, 0);
  };

  const getFinalTotal = () => getSubtotal() + shippingCost;

  const handlePayment = async (orderId) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { alert("Razorpay SDK failed to load."); return; }

    const orderResponse = await instance.post("/payments/create-order/", { order_id: orderId });

    const options = {
      key: orderResponse.data.key,
      amount: orderResponse.data.amount,
      currency: "INR",
      name: "Varaha Crafts",
      description: "Order Payment",
      order_id: orderResponse.data.razorpay_order_id,
      handler: async function (response) {
        await instance.post("/payments/verify/", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        navigate("/order-success", { state: { orderId } });
      },
      theme: { color: "#8B5E3C" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedCourier || !paymentMode) {
      alert("Please select address, courier and payment mode");
      return;
    }
    setIsPlacing(true);
    try {
      const res = await instance.post("/orders/create/", {
        address_id: selectedAddress.id,
        courier_id: selectedCourier.courier_id,
        courier_name: selectedCourier.courier_name,
        payment_mode: paymentMode,
        shipping_cost: shippingCost,
      });
      const localOrderId = res.data.id;
      if (paymentMode === "cod") {
        navigate("/order-success", { state: { orderId: localOrderId } });
        return;
      }
      await handlePayment(localOrderId);
    } catch (err) {
      alert("Order creation failed");
    } finally {
      setIsPlacing(false);
    }
  };

  const activeStep = selectedAddress ? (paymentMode && selectedCourier ? 3 : 2) : 1;

  return (
    <div className="checkout-page">
      {/* Decorative background */}
      <div className="bg-texture" />

      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <div className="brand-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C14 2 6 8 6 15C6 19.4 9.6 23 14 23C18.4 23 22 19.4 22 15C22 8 14 2 14 2Z" fill="#8B5E3C" opacity="0.2"/>
              <path d="M14 4C14 4 7 9.5 7 15C7 18.9 10.1 22 14 22C17.9 22 21 18.9 21 15C21 9.5 14 4 14 4Z" stroke="#8B5E3C" strokeWidth="1.5" fill="none"/>
              <path d="M14 8V22M9 13H19" stroke="#8B5E3C" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">Varaha Crafts — Handmade with love</p>
          </div>
        </div>

        <StepIndicator current={activeStep} />

        <div className="checkout-body">
          {/* LEFT COLUMN */}
          <div className="checkout-left">

            {/* Section: Address */}
            <section className="section-card">
              <div className="section-header">
                <div className="section-number">01</div>
                <h2 className="section-title">Delivery Address</h2>
              </div>

              <div className="address-list">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`address-card ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                  >
                    <div className="address-radio">
                      <div className="radio-dot" />
                    </div>
                    <div className="address-content">
                      <div className="address-name">{addr.full_name}</div>
                      <div className="address-detail">{addr.address_line}</div>
                      <div className="address-detail">{addr.city}, {addr.district}</div>
                      <div className="address-detail">{addr.state} — {addr.pincode}</div>
                    </div>
                    {selectedAddress?.id === addr.id && (
                      <div className="address-check">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className={`add-address-btn ${showAddressForm ? "active" : ""}`}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <span className="plus-icon">{showAddressForm ? "−" : "+"}</span>
                {showAddressForm ? "Cancel" : "Add New Address"}
              </button>

              {showAddressForm && (
                <div className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="Your full name"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile</label>
                      <input className="form-input" placeholder="+91 XXXXX XXXXX"
                        value={newAddress.mobile}
                        onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Address Line</label>
                    <input className="form-input" placeholder="House no., Street, Locality"
                      value={newAddress.address_line}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input className="form-input" placeholder="6-digit pincode"
                        value={newAddress.pincode}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewAddress({ ...newAddress, pincode: value });
                          if (value.length === 6) fetchPincodeDetails(value);
                        }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City / Post Office</label>
                      <input className="form-input" placeholder="Auto-filled"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <input className="form-input" placeholder="Auto-filled"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input className="form-input" placeholder="Auto-filled"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                    </div>
                  </div>

                  <button className="save-address-btn" onClick={handleAddAddress}>
                    Save Address
                  </button>
                </div>
              )}
            </section>

            {/* Section: Payment Mode */}
            <section className="section-card">
              <div className="section-header">
                <div className="section-number">02</div>
                <h2 className="section-title">Payment Method</h2>
              </div>

              <div className="payment-options">
                <label className={`payment-option ${paymentMode === "prepaid" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="prepaid"
                    checked={paymentMode === "prepaid"}
                    onChange={(e) => setPaymentMode(e.target.value)} />
                  <div className="payment-icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 9H20" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="payment-info">
                    <span className="payment-name">Pay Online</span>
                    <span className="payment-desc">UPI, Cards, Net Banking via Razorpay</span>
                  </div>
                  <div className="payment-check" />
                </label>

                <label className={`payment-option ${paymentMode === "cod" ? "selected" : ""}`}>
                  <input type="radio" name="payment" value="cod"
                    checked={paymentMode === "cod"}
                    onChange={(e) => setPaymentMode(e.target.value)} />
                  <div className="payment-icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M11 7V11L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="payment-info">
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-desc">Pay when your order arrives</span>
                  </div>
                  <div className="payment-check" />
                </label>
              </div>
            </section>

            {/* Section: Courier */}
            {couriers.length > 0 && (
              <section className="section-card">
                <div className="section-header">
                  <div className="section-number">03</div>
                  <h2 className="section-title">Shipping Partner</h2>
                </div>

                <div className="courier-list">
                  {couriers.map((courier) => (
                    <label
                      key={courier.courier_id}
                      className={`courier-card ${selectedCourier?.courier_id === courier.courier_id ? "selected" : ""}`}
                    >
                      <input type="radio" name="courier"
                        checked={selectedCourier?.courier_id === courier.courier_id}
                        onChange={() => setSelectedCourier(courier)} />
                      <div className="courier-logo">
                        {courier.courier_name?.charAt(0)}
                      </div>
                      <div className="courier-info">
                        <span className="courier-name">{courier.courier_name}</span>
                        <span className="courier-days">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          {courier.estimated_days} days delivery
                        </span>
                      </div>
                      <div className="courier-rate">₹{courier.rate}</div>
                    </label>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div className="checkout-right">
            <div className="summary-card">
              <div className="summary-header">
                <h2 className="summary-title">Your Order</h2>
                <span className="item-count">{cart?.items?.length || 0} items</span>
              </div>

              {cart && (
                <div className="summary-items">
                  {cart.items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="item-img-wrap">
                        {item.product_image ? (
                          <img src={getImage(item.product_image)} alt={item.product_name} className="item-img" />
                        ) : (
                          <div className="item-img-placeholder">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M3 3h4l2 3h6v9H3V3z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                            </svg>
                          </div>
                        )}
                        <span className="item-qty-badge">{item.quantity}</span>
                      </div>
                      <div className="item-details">
                        <span className="item-name">{item.product_name}</span>
                        <span className="item-unit-price">₹{parseFloat(item.product_price).toFixed(2)} each</span>
                      </div>
                      <span className="item-total">
                        ₹{(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-muted" : ""}>
                    {shippingCost === 0 ? "— Select courier" : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">₹{getFinalTotal().toFixed(2)}</span>
              </div>

              <button
                className={`place-order-btn ${isPlacing ? "loading" : ""}`}
                onClick={handlePlaceOrder}
                disabled={isPlacing}
              >
                {isPlacing ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Placing Order…
                  </span>
                ) : (
                  <>
                    <span>
                      {paymentMode === "cod" ? "Place Order (COD)" : "Proceed to Pay"}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              <div className="trust-badges">
                <div className="badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L9 5H13L10 8L11 12L7 10L3 12L4 8L1 5H5L7 1Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                  </svg>
                  <span>Handcrafted</span>
                </div>
                <div className="badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L8.5 4.5L12 5L9.5 7.5L10 11L7 9.5L4 11L4.5 7.5L2 5L5.5 4.5L7 1Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                  </svg>
                  <span>Secure Payment</span>
                </div>
                <div className="badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7C2 4.2 4.2 2 7 2C9.8 2 12 4.2 12 7C12 9.8 9.8 12 7 12C4.2 12 2 9.8 2 7Z" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;