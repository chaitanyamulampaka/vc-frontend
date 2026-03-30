import { useState } from "react";
import { Link } from "react-router-dom";
import instance from "../services/axiosInstance";
import "../styles/ProductList.css"; // or wherever you place Products.css

const BASE_URL = "https://vc-backend-phpt.onrender.com";

const getImage = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

/* ── Stars ── */
const Stars = ({ rating }) => (
  <div className="pc-stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`pc-star${s <= rating ? " lit" : ""}`}>★</span>
    ))}
  </div>
);

function ProductCard({ product, animDelay = 0 }) {
  const [liked, setLiked] = useState(false);

  const discountPct = product.oldprice && product.cost
    ? Math.round(((product.oldprice - product.cost) / product.oldprice) * 100)
    : 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await instance.post("cart/", { product: product.id, quantity: 1 });
      alert("Added to cart!");
    } catch {
      alert("Please login first.");
    }
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(l => !l);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="pc"
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* ── Image ── */}
      <div className="pc-img-wrap">
        {discountPct > 0 && (
          <div className="pc-badge">{discountPct}% off</div>
        )}

        {product.img
          ? <img src={getImage(product.img)} alt={product.name} className="pc-img" />
          : <div style={{ width: "100%", height: "100%", background: "var(--faint)" }} />
        }

        {/* Wishlist */}
        <button
          className={`pc-wish${liked ? " liked" : ""}`}
          onClick={handleWish}
          aria-label="Wishlist"
        >
          {liked ? "♥" : "♡"}
        </button>

        {/* Quick add */}
        <button
          className="pc-quick"
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="pc-body">
        <div className="pc-name">{product.name}</div>

        {product.rating > 0 && <Stars rating={product.rating} />}

        <div className="pc-price-row">
          <span className="pc-price">₹{product.cost}</span>
          {product.oldprice && (
            <span className="pc-old">₹{product.oldprice}</span>
          )}
        </div>

        <div className={`pc-stock ${product.stock > 0 ? "in" : "out"}`}>
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;