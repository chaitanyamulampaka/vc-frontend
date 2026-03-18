import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {

  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        textAlign: "center",
        padding: "40px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}
    >

      <h1 style={{ color: "green" }}>✅ Order Placed Successfully</h1>

      {orderId && (
        <p style={{ fontSize: "18px", marginTop: "15px" }}>
          Order ID: <strong>#{orderId}</strong>
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        Thank you for shopping with <strong>Varaha Crafts</strong>.
      </p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginRight: "10px",
            cursor: "pointer"
          }}
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/orders")}
          style={{
            padding: "10px 20px",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          View Orders
        </button>
      </div>

    </div>
  );
}

export default OrderSuccess;