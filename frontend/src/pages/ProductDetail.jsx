import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../services/axiosInstance";
import "../styles/ProductDetail.css";

/* ── Helpers ── */
const Stars = ({ rating }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`pd-star${s <= rating ? " lit" : ""}`}>★</span>
    ))}
  </div>
);

const Avatar = ({ name }) => (
  <div className="pd-avatar">
    {name ? String(name).charAt(0).toUpperCase() : "?"}
  </div>
);

const getAvg = (reviews) =>
  reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

const getDist = (reviews) => {
  const d = { 5:0, 4:0, 3:0, 2:0, 1:0 };
  reviews.forEach(r => { d[Math.round(r.rating)] = (d[Math.round(r.rating)] || 0) + 1; });
  return d;
};

/* ══════════════════════════════ */
function ProductDetail() {
  const { id } = useParams();

  const [product,       setProduct]       = useState(null);
  const [images,        setImages]        = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [reviews,       setReviews]       = useState([]);
  const [rating,        setRating]        = useState(5);
  const [hoverStar,     setHoverStar]     = useState(0);
  const [comment,       setComment]       = useState("");
  const [revImages,     setRevImages]     = useState([]);
  const [revError,      setRevError]      = useState("");

  useEffect(() => {
    instance.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
        if (res.data.img) setSelectedImage(res.data.img);
      }).catch(console.log);

    instance.get(`products/${id}/images/`)
      .then(res => {
        setImages(res.data);
        if (res.data.length > 0) setSelectedImage(res.data[0].image);
      }).catch(console.log);

    instance.get(`reviews/?product=${id}`)
      .then(res => setReviews(res.data))
      .catch(console.log);
  }, [id]);

  if (!product) return (
    <div className="pd-loading">
      <div className="pd-ring" />
      Loading…
    </div>
  );

  const discountPct = product.oldprice
    ? Math.round(((product.oldprice - product.cost) / product.oldprice) * 100)
    : 0;

  const avg  = getAvg(reviews);
  const dist = getDist(reviews);

  const handleAddToCart = async () => {
    try {
      await instance.post("cart/", { product: id, quantity });
      alert("Added to cart!");
    } catch { alert("Please login first."); }
  };
  const handleBuyNow = async () => {
    try {
      
      window.location.href = "/checkout";
    } catch { alert("Please login first."); } 
  };


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setRevError("");
    const fd = new FormData();
    fd.append("product", id);
    fd.append("rating", rating);
    fd.append("comment", comment);
    revImages.forEach(img => fd.append("images", img));
    try {
      await instance.post("reviews/", fd);
      setRating(5); setComment(""); setRevImages([]);
      const res = await instance.get(`reviews/?product=${id}`);
      setReviews(res.data);
    } catch (err) {
      const d = err.response?.data;
      if (Array.isArray(d))          setRevError(d[0]);
      else if (d?.non_field_errors)  setRevError(d.non_field_errors[0]);
      else                           setRevError("Error submitting review.");
    }
  };

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <div className="pd-crumb">
        <span>Home</span>
        <span className="sep">›</span>
        <span>Shop</span>
        <span className="sep">›</span>
        <span className="cur">{product.name}</span>
      </div>

      {/* ── Product ── */}
      <div className="pd-grid">

        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main">
            {discountPct > 0 && <div className="pd-off">{discountPct}% off</div>}
            {selectedImage && <img src={selectedImage} alt={product.name} />}
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map(img => (
                <img
                  key={img.id}
                  src={img.image}
                  alt=""
                  onClick={() => setSelectedImage(img.image)}
                  className={`pd-thumb${selectedImage === img.image ? " active" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          <p className="pd-craft">Handcrafted</p>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-stars-row">
            <Stars rating={product.rating} />
            <span className="pd-rcount">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">₹{product.cost}</span>
            {product.oldprice && (
              <span className="pd-old">₹{product.oldprice}</span>
            )}
            {discountPct > 0 && (
              <span className="pd-save">Save ₹{product.oldprice - product.cost}</span>
            )}
          </div>

          <div className={`pd-stock ${product.stock > 0 ? "in" : "out"}`}>
            <div className="pd-dot" />
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </div>

          <div className="pd-rule" />

          <p className="pd-qty-lbl">Quantity</p>
          <div className="pd-qty">
            <button className="pd-qbtn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <div className="pd-qval">{quantity}</div>
            <button className="pd-qbtn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
          </div>

          <div className="pd-actions">
            <button
              className="pd-btn pd-btn-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="pd-btn pd-btn-buy"
              disabled={product.stock === 0}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          <div className="pd-rule" />

          <div className="pd-meta">
            <div className="pd-meta-row"><span>🚚</span><span>Free shipping on orders above ₹999</span></div>
            <div className="pd-meta-row"><span>↩️</span><span>Easy 7-day returns</span></div>
            <div className="pd-meta-row"><span>🔒</span><span>Secure checkout</span></div>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      {product.description && (
        <div className="pd-desc">
          <p className="pd-desc-lbl">About this piece</p>
          <p className="pd-desc-text">{product.description}</p>
        </div>
      )}

      {/* ── Reviews ── */}
      <div className="pd-reviews">
        <div className="pd-rev-head">
          <h2 className="pd-rev-title">Reviews</h2>
          <span className="pd-rev-n">{reviews.length} total</span>
        </div>

        {reviews.length > 0 && (
          <div className="pd-summary">
            <div>
              <div className="pd-avg-big">{avg}</div>
              <Stars rating={Math.round(avg)} />
              <div className="pd-avg-sub">{reviews.length} reviews</div>
            </div>
            <div className="pd-bars">
              {[5,4,3,2,1].map(s => (
                <div key={s} className="pd-bar-row">
                  <span className="pd-bar-lbl">{s}</span>
                  <div className="pd-bar-track">
                    <div
                      className="pd-bar-fill"
                      style={{ width: `${((dist[s] || 0) / reviews.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="pd-empty">No reviews yet. Be the first to write one.</p>
        ) : (
          <div className="pd-rev-list">
            {reviews.map((rev, i) => (
              <div
                key={rev.id}
                className="pd-rev-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="pd-rev-top">
                  <Avatar name={rev.user} />
                  <div>
                    <div className="pd-rev-name">{rev.user}</div>
                    <div className="pd-rev-stars"><Stars rating={rev.rating} /></div>
                  </div>
                </div>
                <p className="pd-rev-body">{rev.comment}</p>
                {rev.images?.length > 0 && (
                  <div className="pd-rev-photos">
                    {rev.images.map(img => (
                      <img key={img.id} src={img.image} alt="" className="pd-rev-photo" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Write review */}
        <div className="pd-write">
          <p className="pd-write-lbl">Write a review</p>

          <div className="pd-picker">
            {[1,2,3,4,5].map(s => (
              <span
                key={s}
                className={`pd-pstar${s <= (hoverStar || rating) ? " lit" : ""}`}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setRating(s)}
              >★</span>
            ))}
          </div>

          <form onSubmit={handleReviewSubmit}>
            <div className="pd-field">
              <label>Your comment</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this piece…"
                required
              />
            </div>

            <div className="pd-field">
              <label>Photos (optional)</label>
              <div className="pd-upload">
                <span>↑</span> Upload images
                <input
                  type="file" multiple accept="image/*"
                  onChange={e => setRevImages([...e.target.files])}
                />
              </div>
              {revImages.length > 0 && (
                <div className="pd-file-n">{revImages.length} file{revImages.length > 1 ? "s" : ""} selected</div>
              )}
            </div>

            {revError && <p className="pd-form-err">{revError}</p>}

            <button type="submit" className="pd-submit">Submit Review</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default ProductDetail;