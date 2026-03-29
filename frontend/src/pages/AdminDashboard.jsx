import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await instance.get("/admin/artist-products/");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approveProduct = async (id) => {
    await instance.post(`/admin/artist-products/${id}/approve/`);
    fetchProducts();
  };

  const rejectProduct = async (id) => {
    await instance.post(`/admin/artist-products/${id}/reject/`);
    fetchProducts();
  };

  if (loading) return <div style={styles.loader}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Product Approvals</h2>
        <p style={styles.subtitle}>{products.length} items requiring review</p>
      </header>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            {/* Image Section */}
            <div style={styles.imageGrid}>
              {product.images?.slice(0, 3).map((imgObj, i) => (
                <img
                  key={i}
                  src={imgObj.image}
                  alt="product"
                  style={styles.productImage}
                  onError={(e) => (e.target.src = "/fallback.png")}
                />
              ))}
            </div>

            {/* Content Section */}
            <div style={styles.cardContent}>
              <div style={styles.statusBadge(product.status)}>{product.status}</div>
              <h3 style={styles.productName}>{product.name}</h3>
              
              <div style={styles.priceRow}>
                <span style={styles.cost}>₹{product.cost}</span>
                {product.oldprice && (
                  <span style={styles.oldPrice}>₹{product.oldprice}</span>
                )}
                {product.discount && (
                  <span style={styles.discountTag}>{product.discount}% OFF</span>
                )}
              </div>

              <p style={styles.description}>{product.description}</p>

              <div style={styles.metaInfo}>
                <span><strong>Stock:</strong> {product.stock}</span>
                <span>{"⭐".repeat(product.rating || 0)}</span>
              </div>

              {/* Action Buttons */}
              {product.status === "pending" && (
                <div style={styles.buttonGroup}>
                  <button onClick={() => approveProduct(product.id)} style={styles.approveBtn}>
                    Approve
                  </button>
                  <button onClick={() => rejectProduct(product.id)} style={styles.rejectBtn}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "transform 0.2s",
    border: "1px solid #e2e8f0",
  },
  imageGrid: {
    display: "flex",
    gap: "8px",
    padding: "15px",
    backgroundColor: "#f1f5f9",
    overflowX: "auto",
  },
  productImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid white",
  },
  cardContent: {
    padding: "20px",
  },
  statusBadge: (status) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "12px",
    backgroundColor: status === "approved" ? "#dcfce7" : status === "rejected" ? "#fee2e2" : "#fef9c3",
    color: status === "approved" ? "#166534" : status === "rejected" ? "#991b1b" : "#854d0e",
  }),
  productName: {
    fontSize: "1.25rem",
    color: "#1e293b",
    margin: "0 0 10px 0",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  cost: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#0f172a",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  discountTag: {
    color: "#10b981",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  description: {
    fontSize: "0.9rem",
    color: "#475569",
    lineHeight: "1.5",
    height: "4.5em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    marginBottom: "15px",
  },
  metaInfo: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#64748b",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "15px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  approveBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  rejectBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ef4444",
    backgroundColor: "transparent",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    color: "#64748b",
  }
};

export default AdminDashboard;