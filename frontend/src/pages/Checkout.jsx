import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

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

function Checkout() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);

  const [paymentMode, setPaymentMode] = useState("");
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const fetchPincodeDetails = async (pincode) => {
  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

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

  /* ---------------- Fetch Addresses & Cart ---------------- */
  useEffect(() => {
    fetchAddresses();
    fetchCart();
  }, []);
const [showAddressForm, setShowAddressForm] = useState(false);

const [newAddress, setNewAddress] = useState({
  full_name: "",
  mobile: "",
  address_line: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
});
const handleAddAddress = async () => {
  try {
    const res = await instance.post("/addresses/", newAddress);

    setAddresses([...addresses, res.data]);
    setSelectedAddress(res.data);
    setShowAddressForm(false);

    alert("Address added successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to add address");
  }
};
  const fetchAddresses = async () => {
    const res = await instance.get("/addresses/");
    console.log("Fetched addresses:", res.data);
    setAddresses(res.data);
    if (res.data.length > 0) setSelectedAddress(res.data[0]);
  };

  const fetchCart = async () => {
    const res = await instance.get("/cart/");
    setCart(res.data);
  };

  /* ---------------- Fetch Couriers ---------------- */
  useEffect(() => {
    if (selectedAddress?.pincode && paymentMode) {
      fetchCouriers(selectedAddress.pincode, paymentMode);
    }
  }, [selectedAddress, paymentMode]);

  const fetchCouriers = async (pincode, paymentMode) => {
    const res = await instance.get(
  `orders/shipping/options/?delivery_pincode=${pincode}&payment_mode=${paymentMode}`
);
    console.log("Fetched couriers:", res.data);

    const sorted = res.data.sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );

    setCouriers(sorted);
  };

  useEffect(() => {
    if (selectedCourier) {
      setShippingCost(parseFloat(selectedCourier.rate || 0));
    } else {
      setShippingCost(0);
    }
  }, [selectedCourier]);

  /* ---------------- Totals ---------------- */
  const getSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) =>
        total + parseFloat(item.product_price) * item.quantity,
      0
    );
  };

  const getFinalTotal = () => getSubtotal() + shippingCost;

  /* ---------------- Razorpay ---------------- */
  const handlePayment = async (orderId) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const orderResponse = await instance.post(
      "/payments/create-order/",
      { order_id: orderId }
    );

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

        alert("Payment Successful!");
        navigate("/order-success", {
          state: { orderId: orderId }
        });
        },

      theme: { color: "#16a34a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* ---------------- Place Order ---------------- */
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedCourier || !paymentMode) {
      alert("Select address, courier and payment mode");
      return;
    }

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
        alert("Order placed successfully (COD)");
        navigate("/order-success", {
        state: { orderId: localOrderId }
  });
        return;
      }

      await handlePayment(localOrderId);

    } catch (err) {
      console.error(err);
      alert("Order creation failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#ffffff",
        color: "#000000",
      }}
    >
      <h2>Checkout</h2>

      {/* Addresses */}
      <h3>Saved Addresses</h3>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => setSelectedAddress(addr)}
          style={{
            border:
              selectedAddress?.id === addr.id
                ? "2px solid green"
                : "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          <strong>{addr.full_name}</strong>
          <p>{addr.address_line}</p>
          <p>
            {addr.city}, {addr.state} - {addr.pincode}
          </p>
        </div>
      ))}

      <hr />
<button
  onClick={() => setShowAddressForm(!showAddressForm)}
  style={{
    marginBottom: "15px",
    padding: "6px 12px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
  }}
>
  + Add New Address
</button>
{showAddressForm && (
  <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
    <input
      placeholder="Full Name"
      value={newAddress.full_name}
      onChange={(e) =>
        setNewAddress({ ...newAddress, full_name: e.target.value })
      }
    />

    <input
      placeholder="Mobile"
      value={newAddress.mobile}
      onChange={(e) =>
        setNewAddress({ ...newAddress, mobile: e.target.value })
      }
    />

    <input
      placeholder="Address Line"
      value={newAddress.address_line}
      onChange={(e) =>
        setNewAddress({ ...newAddress, address_line: e.target.value })
      }
    />

    <input
      placeholder="City"
      value={newAddress.city}
      onChange={(e) =>
        setNewAddress({ ...newAddress, city: e.target.value })
      }
    />

    <input
      placeholder="District"
      value={newAddress.district}
      onChange={(e) =>
        setNewAddress({ ...newAddress, district: e.target.value })
      }
    />

    <input
      placeholder="State"
      value={newAddress.state}
      onChange={(e) =>
        setNewAddress({ ...newAddress, state: e.target.value })
      }
    />

    <input
  placeholder="Pincode"
  value={newAddress.pincode}
  onChange={(e) => {
    const value = e.target.value;

    setNewAddress({ ...newAddress, pincode: value });

    if (value.length === 6) {
      fetchPincodeDetails(value);
    }
  }}
/>

    <button
      onClick={handleAddAddress}
      style={{
        marginTop: "10px",
        padding: "6px 12px",
        backgroundColor: "green",
        color: "white",
        border: "none",
      }}
    >
      Save Address
    </button>
  </div>
)}
      {/* Payment Mode */}
      <h3>Select Payment Mode</h3>

      <label>
        <input
          type="radio"
          name="payment"
          value="prepaid"
          checked={paymentMode === "prepaid"}
          onChange={(e) => setPaymentMode(e.target.value)}
        />
        Prepaid
      </label>

      <br />

      <label>
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={paymentMode === "cod"}
          onChange={(e) => setPaymentMode(e.target.value)}
        />
        Cash on Delivery
      </label>

      <hr />

      {/* Couriers */}
      {couriers.length > 0 && (
        <>
          <h3>Select Courier</h3>
          {couriers.map((courier) => (
            <div
              key={courier.courier_id}
              style={{
                border:
                  selectedCourier?.courier_id === courier.courier_id
                    ? "2px solid green"
                    : "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <label>
                <input
                  type="radio"
                  name="courier"
                  checked={
                    selectedCourier?.courier_id === courier.courier_id
                  }
                  onChange={() => setSelectedCourier(courier)}
                />
                <strong> {courier.courier_name}</strong>
                <br />
                ₹{courier.rate} | {courier.estimated_days} days
              </label>
            </div>
          ))}
        </>
      )}

      <hr />

      {/* Summary */}
      <h3>Order Summary</h3>
      {cart && (
        <div style={{ border: "1px solid #ddd", padding: "10px" }}>
          {cart.items.map((item) => (
            <div key={item.id}>
              {item.product_name} × {item.quantity}
              <span style={{ float: "right" }}>
                ₹
                {(
                  parseFloat(item.product_price) * item.quantity
                ).toFixed(2)}
              </span>
            </div>
          ))}
          <hr />
          <div>
            Shipping: ₹{shippingCost.toFixed(2)}
          </div>
          <strong>
            Total: ₹{getFinalTotal().toFixed(2)}
          </strong>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;