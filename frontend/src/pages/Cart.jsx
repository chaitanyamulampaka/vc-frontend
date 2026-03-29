import { useEffect, useState, useRef } from "react";
import instance from "../services/axiosInstance";

/* ─── Inline styles as a JS object so this is a single-file deliverable ─── */
const S = {
  "@import": `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');`,
};

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await instance.get("/cart/");
      setCart(res.data);
    } catch (e) {
      console.error("Error fetching cart", e);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (productId) => {
    try {
      await instance.post("/cart/", { product: productId, quantity: 1 });
      fetchCart();
    } catch (e) { console.error(e); }
  };

  const decreaseQuantity = async (item) => {
    try {
      if (item.quantity === 1) {
        removeItem(item.id);
      } else {
        await instance.post("/cart/", { product: item.product, quantity: -1 });
        fetchCart();
      }
    } catch (e) { console.error(e); }
  };

  const removeItem = (itemId) => {
    setRemovingId(itemId);
    setTimeout(async () => {
      try {
        await instance.delete(`/cart/${itemId}/`);
        fetchCart();
      } catch (e) { console.error(e); }
      finally { setRemovingId(null); }
    }, 420);
  };
  const handleCheckout = () => {  
    window.location.href = "/checkout";
  };

  const getTotal = () =>
    cart?.items.reduce(
      (t, i) => t + parseFloat(i.product_price) * i.quantity, 0
    ) ?? 0;

  const fmt = (n) =>
    parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const handleProductClick = (item) => {
    window.location.href = `/product/${item.product_slug ?? item.product}`;
  };

  /* ── Thumbnail helper ── */
  const Thumb = ({ item }) => {
    const hasImg = item.product_image && !imgErrors[item.id];
    return (
      <div style={styles.thumb}>
        {hasImg ? (
          <img
            src={item.product_image}
            alt={item.product_name}
            style={styles.thumbImg}
            onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))}
          />
        ) : (
          <div style={styles.thumbFallback}>
            <span style={styles.thumbInitial}>
              {item.product_name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span style={styles.thumbBadge}>Handmade</span>
      </div>
    );
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <p style={{ color: "#8a7566", fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>
        Gathering your treasures…
      </p>
    </div>
  );

  /* ── Empty ── */
  if (!cart || cart.items.length === 0) return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="96" height="96">
          <circle cx="40" cy="40" r="38" stroke="#e8dcc8" strokeWidth="1.5" strokeDasharray="4 3"/>
          <path d="M24 28h4l5 18h14l4-13H30" stroke="#c09a3e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="35" cy="50" r="2" fill="#c09a3e"/>
          <circle cx="46" cy="50" r="2" fill="#c09a3e"/>
        </svg>
      </div>
      <h2 style={styles.emptyH2}>Your basket is empty</h2>
      <p style={styles.emptyP}>Discover our handcrafted wonders and fill it with love.</p>
      <a href="/product" style={styles.emptyCta}>Explore Collection</a>
    </div>
  );

  /* ── Main ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .cart-item-card {
          display: grid;
          grid-template-columns: 108px 1fr auto;
          gap: 22px;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e8dcc8;
          border-radius: 18px;
          padding: 20px 24px;
          box-shadow: 0 4px 24px rgba(44,31,20,.07);
          animation: fadeUp .45s ease both;
          transition: box-shadow .25s, transform .25s, opacity .38s, max-height .38s;
          overflow: hidden;
        }
        .cart-item-card:hover {
          box-shadow: 0 10px 40px rgba(44,31,20,.12);
          transform: translateY(-2px);
        }
        .cart-item-card.removing {
          opacity: 0;
          transform: translateX(32px) scale(.97);
          max-height: 0;
          padding: 0 24px;
          margin: 0;
          border-width: 0;
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .cart-item-card {
            grid-template-columns: 80px 1fr;
            grid-template-rows: auto auto;
            gap: 14px;
          }
          .cart-item-subtotal {
            grid-column: 1 / -1;
            flex-direction: row !important;
            justify-content: space-between;
            border-top: 1px solid #e8dcc8;
            padding-top: 12px;
            margin-top: 2px;
          }
          .cart-body-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .qty-btn {
          width: 32px; height: 32px;
          border: none; background: transparent;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          color: #6b4f3a;
          transition: background .15s, color .15s;
          border-radius: 6px;
        }
        .qty-btn:hover { background: #e8dcc8; color: #b85c38; }

        .remove-btn {
          display: flex; align-items: center; gap: 5px;
          background: none; border: none; color: #8a7566;
          font-size: 12px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; padding: 4px 8px; border-radius: 6px;
          transition: color .2s, background .2s;
          letter-spacing: .02em;
        }
        .remove-btn:hover { color: #b85c38; background: rgba(184,92,56,.07); }

        .checkout-btn {
          width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          background: #b85c38; color: #fff; border: none;
          border-radius: 12px; padding: 14px 24px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 500; letter-spacing: .08em;
          text-transform: uppercase; cursor: pointer;
          box-shadow: 0 4px 18px rgba(184,92,56,.32);
          transition: background .2s, transform .15s, box-shadow .2s;
          margin-bottom: 14px;
        }
        .checkout-btn:hover {
          background: #8e3e22;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(184,92,56,.40);
        }
        .checkout-btn:active { transform: translateY(0); }

        .product-link {
          cursor: pointer; text-decoration: none;
          transition: opacity .18s;
        }
        .product-link:hover { opacity: .82; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Scroll-bar thin */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f2ead8; }
        ::-webkit-scrollbar-thumb { background: #c09a3e44; border-radius: 4px; }
      `}</style>

      <div style={styles.page}>

        {/* ── Header ── */}
        <header style={styles.header}>
          <span style={styles.headerOrn}>✦</span>
          <h1 style={styles.headerTitle}>Your Basket</h1>
          <p style={styles.headerSub}>
            {cart.items.length} handpicked item{cart.items.length !== 1 ? "s" : ""}
          </p>
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerLeaf}>❧</span>
            <span style={{ ...styles.dividerLine, transform: "scaleX(-1)" }} />
          </div>
        </header>

        {/* ── Body ── */}
        <div className="cart-body-grid" style={styles.body}>

          {/* Items */}
          <div style={styles.itemsList}>
            {cart.items.map((item, i) => (
              <div
                key={item.id}
                className={`cart-item-card${removingId === item.id ? " removing" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Thumbnail — clickable */}
                <a
                  className="product-link"
                  onClick={() => handleProductClick(item)}
                  title={`View ${item.product_name}`}
                >
                  <Thumb item={item} />
                </a>

                {/* Details */}
                <div style={styles.details}>
                  <a
                    className="product-link"
                    style={{ display: "block" }}
                    onClick={() => handleProductClick(item)}
                  >
                    <h3 style={styles.itemName}>{item.product_name}</h3>
                    <p style={styles.itemUnit}>₹{fmt(item.product_price)} / unit</p>
                  </a>

                  <div style={styles.controls}>
                    {/* Qty */}
                    <div style={styles.qty}>
                    {/* Decrease Button */}
                    <button
                      className="qty-btn"
                      style={{ ...styles.qtyBtnManual, border: 'none' }} 
                      onClick={() => decreaseQuantity(item)}
                      aria-label="Decrease"
                    >
                      <svg viewBox="0 0 16 16" width="12" height="12" style={{ display: 'block' }}>
                        <line x1="2" y1="8" x2="14" y2="8" stroke="#6b4f3a" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </button>

                    <span style={styles.qtyVal}>{item.quantity}</span>

                    {/* Increase Button */}
                    <button
                      className="qty-btn"
                      style={{ ...styles.qtyBtnManual, border: 'none' }}
                      onClick={() => increaseQuantity(item.product)}
                      aria-label="Increase"
                    >
                      <svg viewBox="0 0 16 16" width="12" height="12" style={{ display: 'block' }}>
                        <line x1="8" y1="2" x2="8" y2="14" stroke="#6b4f3a" strokeWidth="2.5" strokeLinecap="round"/>
                        <line x1="2" y1="8" x2="14" y2="8" stroke="#6b4f3a" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>

                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                        <path d="M3 4h10M6 4V3h4v1M5 4l.5 8h5l.5-8"
                          stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="cart-item-subtotal" style={styles.subtotal}>
                  <span style={styles.subtotalLabel}>Subtotal</span>
                  <span style={styles.subtotalVal}>
                    ₹{fmt(parseFloat(item.product_price) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside style={styles.summary}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryHeading}>Order Summary</h2>

              <div style={styles.summaryLines}>
                {cart.items.map((item) => (
                  <div key={item.id} style={styles.summaryLine}>
                    <span style={styles.summaryLineName}>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span style={styles.summaryLineAmt}>
                      ₹{fmt(parseFloat(item.product_price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.summaryDivWrapper}>
                <span style={styles.summaryDivLine} />
                <span style={{ color: "#c09a3e", fontSize: 12 }}>✦</span>
                <span style={styles.summaryDivLine} />
              </div>

              <div style={styles.totalRow}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#2c1f14" }}>Total</span>
                <span style={styles.totalAmt}>₹{fmt(getTotal())}</span>
              </div>

              <p style={styles.freeShip}>🌿 Free delivery on orders above ₹999</p>

              <button className="checkout-btn" onClick={handleCheckout}>
                <span>Proceed to Checkout</span>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5"
                    stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <a href="/product" style={styles.continueShopping}>← Continue Shopping</a>
            </div>

            <div style={styles.badge}>
              <span>🤝</span> Ethically sourced · Artisan made
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/* ─── JS style objects ─── */
const styles = {
  page: {
    background: "#faf6ef",
    minHeight: "100vh",
    padding: "48px 24px 80px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#2c1f14",
    backgroundImage: `
      radial-gradient(ellipse at 8% 0%, rgba(200,160,100,.12) 0%, transparent 55%),
      radial-gradient(ellipse at 92% 100%, rgba(61,90,69,.09) 0%, transparent 55%)
    `,
  },
  /* Header */
  header: { textAlign: "center", marginBottom: 52, animation: "fadeUp .6s ease both" },
  headerOrn: { display: "block", fontSize: 12, color: "#c09a3e", letterSpacing: 8, marginBottom: 14 },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(38px, 6vw, 58px)",
    fontWeight: 600, color: "#2c1f14",
    letterSpacing: "-.02em", lineHeight: 1, margin: "0 0 8px",
  },
  headerSub: {
    fontSize: 13, fontWeight: 300, color: "#8a7566",
    letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 22px",
  },
  divider: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14 },
  dividerLine: { height: 1, width: 60, background: "linear-gradient(to right, transparent, #e8dcc8)", display: "block" },
  dividerLeaf: { color: "#c09a3e", fontSize: 20, lineHeight: 1 },

  /* Body */
  body: { maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" },
  itemsList: { display: "flex", flexDirection: "column", gap: 14 },

  /* Thumbnail */
  thumb: {
    position: "relative", width: 108, height: 108,
    background: "#f2ead8", borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(180,140,90,.05) 5px, rgba(180,140,90,.05) 10px)`,
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbFallback: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
  thumbInitial: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40, fontWeight: 700,
    color: "#c97c55", opacity: .65, lineHeight: 1,
  },
  thumbBadge: {
    position: "absolute", bottom: 6, left: "50%",
    transform: "translateX(-50%)",
    background: "#b85c38", color: "#fff",
    fontSize: 9, fontWeight: 500,
    letterSpacing: ".08em", textTransform: "uppercase",
    padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
  },

  /* Item details */
  details: { display: "flex", flexDirection: "column", gap: 4 },
  itemName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 19, fontWeight: 600,
    color: "#2c1f14", margin: "0 0 2px", lineHeight: 1.25,
  },
  itemUnit: { fontSize: 12, color: "#8a7566", margin: "0 0 10px", fontWeight: 300, letterSpacing: ".02em" },
  controls: { display: "flex", alignItems: "center", gap: 14 },



  /* Subtotal */
  subtotal: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, minWidth: 92 },
  subtotalLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: "#8a7566", fontWeight: 400 },
  subtotalVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, fontWeight: 700,
    color: "#8e3e22", lineHeight: 1,
  },

  /* Summary */
  summary: { position: "sticky", top: 28, display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .5s ease .1s both" },
  summaryCard: {
    background: "#fff", border: "1px solid #e8dcc8",
    borderRadius: 18, padding: "28px 24px 22px",
    boxShadow: "0 8px 40px rgba(44,31,20,.10)",
  },
  summaryHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, fontWeight: 600,
    color: "#2c1f14", margin: "0 0 18px",
  },
  summaryLines: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  summaryLine: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  summaryLineName: { fontSize: 13, color: "#8a7566", fontWeight: 300, flex: 1 },
  summaryLineAmt: { fontSize: 13, color: "#6b4f3a", fontWeight: 500, whiteSpace: "nowrap" },
  summaryDivWrapper: { display: "flex", alignItems: "center", gap: 10, margin: "14px 0" },
  summaryDivLine: { flex: 1, height: 1, background: "#e8dcc8", display: "block" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  totalAmt: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26, fontWeight: 700,
    color: "#8e3e22", lineHeight: 1,
  },
  freeShip: {
    fontSize: 12, color: "#4f7260",
    background: "rgba(61,90,69,.07)",
    borderRadius: 8, padding: "8px 12px",
    marginBottom: 20, fontWeight: 400, letterSpacing: ".01em",
  },
  continueShopping: {
    display: "block", textAlign: "center",
    fontSize: 13, color: "#8a7566",
    textDecoration: "none", letterSpacing: ".02em",
    transition: "color .2s",
  },
  badge: {
    textAlign: "center", fontSize: 12,
    color: "#8a7566", background: "#f2ead8",
    border: "1px solid #e8dcc8",
    borderRadius: 10, padding: "10px 16px",
    fontWeight: 300, letterSpacing: ".03em",
  },

  /* Loading */
  loading: {
    minHeight: "60vh", display: "flex",
    flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 16,
    background: "#faf6ef",
  },
  spinner: {
    width: 36, height: 36,
    border: "2px solid #e8dcc8",
    borderTopColor: "#b85c38",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
  },

  /* Empty */
  empty: {
    minHeight: "80vh", display: "flex",
    flexDirection: "column", alignItems: "center",
    justifyContent: "center", textAlign: "center",
    gap: 12, fontFamily: "'DM Sans', sans-serif",
    color: "#2c1f14", background: "#faf6ef", padding: "40px 24px",
  },
  emptyIcon: { marginBottom: 8 },
  emptyH2: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 30, fontWeight: 600, margin: 0,
  },
  emptyP: { fontSize: 14, color: "#8a7566", fontWeight: 300, maxWidth: 280, margin: 0 },
  emptyCta: {
    display: "inline-block", marginTop: 12,
    padding: "12px 30px",
    background: "#b85c38", color: "#fff",
    borderRadius: 12, textDecoration: "none",
    fontSize: 13, fontWeight: 500,
    letterSpacing: ".07em", textTransform: "uppercase",
    boxShadow: "0 4px 16px rgba(184,92,56,.28)",
    transition: "background .2s, transform .15s",
  },
qty: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e8dcc8",
    borderRadius: "9px",
    background: "#ffffff", // Pure white inside the control for contrast
    height: "34px",
    overflow: "hidden",
  },
  qtyBtnManual: {
    width: 32,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    padding: 0,
  },
qtyVal: {
    minWidth: "38px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#2c1f14", // Deep ink color
    borderLeft: "1px solid #e8dcc8",
    borderRight: "1px solid #e8dcc8",
    lineHeight: "34px",
    background: "#faf6ef", // Light cream for the value area
  },
};

export default Cart;