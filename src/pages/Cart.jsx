import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await instance.get("/cart/");
      setCart(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart", error);
      setLoading(false);
    }
  };

  // Increase Quantity
  const increaseQuantity = async (productId) => {
    try {
      await instance.post("/cart/", {
        product: productId,
        quantity: 1,
      });
      fetchCart();
    } catch (error) {
      console.error("Error increasing quantity", error);
    }
  };

  // Decrease Quantity
  const decreaseQuantity = async (item) => {
    try {
      if (item.quantity === 1) {
        await removeItem(item.id);
      } else {
        await instance.post("/cart/", {
          product: item.product,
          quantity: -1,
        });
        fetchCart();
      }
    } catch (error) {
      console.error("Error decreasing quantity", error);
    }
  };

  // Remove Item
  const removeItem = async (itemId) => {
    try {
      await instance.delete(`/cart/${itemId}/`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  // Calculate Total
  const getTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) =>
        total + parseFloat(item.product_price) * item.quantity,
      0
    );
  };

  if (loading) return <h3 style={{ padding: "20px" }}>Loading cart...</h3>;

  if (!cart || cart.items.length === 0)
    return <h3 style={{ padding: "20px" }}>Your cart is empty 🛒</h3>;

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>

      {cart.items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          {/* Product Info */}
          <div>
            <h4>{item.product_name}</h4>
            <p>Price: ₹{item.product_price}</p>
            <p>
              Subtotal: ₹
              {parseFloat(item.product_price) * item.quantity}
            </p>
          </div>

          {/* Quantity Controls */}
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "10px" }}>
              <button
                onClick={() => decreaseQuantity(item)}
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                }}
              >
                -
              </button>

              <span style={{ fontWeight: "bold", margin: "0 10px" }}>
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(item.product)}
                style={{
                  padding: "5px 10px",
                  marginLeft: "5px",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "right",
          borderTop: "2px solid #ddd",
          paddingTop: "20px",
        }}
      >
        <h3>Total: ₹{getTotal().toFixed(2)}</h3>

        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;