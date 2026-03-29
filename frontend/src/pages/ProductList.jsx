import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import instance from "../services/axiosInstance";
import "../styles/ProductList.css";

const FILTERS = ["All", "In Stock"];

const Skeleton = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="pl-skel" />
    ))}
  </>
);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState("All");

  useEffect(() => {
    instance.get("products/")
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (active === "In Stock") return p.stock > 0;
    if (active === "On Sale")  return !!p.oldprice;
    return true;
  });

  return (
    <div className="pl-page">

      {/* Header */}
      <div className="pl-header">
        <div>
 
          
          {!loading && (
            <p className="pl-count">
              {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="pl-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`pl-filter${active === f ? " on" : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="pl-grid">
        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="pl-empty">No pieces found.</div>
        ) : (
          filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              animDelay={i * 0.04}
            />
          ))
        )}
      </div>

    </div>
  );
}

export default ProductList;