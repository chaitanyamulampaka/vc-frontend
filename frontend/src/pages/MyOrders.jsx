import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await instance.get("/orders/my-orders/");
    setOrders(res.data);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>

      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (

        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px"
          }}
        >

          <h3>Order #{order.id}</h3>

          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total_amount}</p>

          <h4>Products</h4>

          {order.items.map((item, index) => (
            <div key={index}>
              {item.product_name} × {item.quantity}
            </div>
          ))}

        </div>

      ))}

    </div>
  );
}

export default MyOrders;