import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosInstance";
import "../styles/MyOrders.css";

const BASE_URL = "https://vc-backend-phpt.onrender.com";

const getImage = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/orders/my-orders/");
      setOrders(res.data || []);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mo-loading">
        <div className="mo-spinner" />
      </div>
    );
  }

  return (
    <div className="mo-root">
      <div className="mo-header">
        <h2 className="mo-title">My Orders</h2>
        <span className="mo-count">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="mo-empty">
          <p>No orders placed yet.</p>
        </div>
      ) : (
        <div className="mo-list">
          {orders.map((order) => (
            <div className="mo-card" key={order.id}>

              {/* Order Header */}
              <div className="mo-card-head">
                <div className="mo-order-id">
                  <span className="mo-order-label">Order</span>
                  <span>#{order.id}</span>
                </div>
                <div className="mo-card-meta">
                  {order.created_at && (
                    <span className="mo-date">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  )}
                  <span className={`mo-badge mo-badge--${order.status || "pending"}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mo-items">
                {(order.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="mo-item"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    <div className="mo-thumb">
                      <img
                        src={
                          item.product_image
                            ? getImage(item.product_image)
                            : "https://via.placeholder.com/52"
                        }
                        alt={item.product_name}
                      />
                    </div>
                    <div className="mo-item-info">
                      <p className="mo-item-name">{item.product_name}</p>
                      <p className="mo-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="mo-item-price">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mo-card-foot">
                {order.tracking_number && (
                  <span className="mo-tracking">
                    Tracking: <strong>{order.tracking_number}</strong>
                  </span>
                )}
                <div className="mo-total">
                  <span className="mo-total-label">Order total</span>
                  <span className="mo-total-val">₹{order.total_amount}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;