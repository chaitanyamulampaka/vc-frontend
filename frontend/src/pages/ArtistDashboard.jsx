import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";
import "../styles/ArtistDashboard.css";

function ArtistDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        cost: "",
        discount: "",
        oldprice: "",
        stock: "",
        rating: 1,
        features: "",
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchProducts = async () => {
        try {
            const res = await instance.get("/artist/products/");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const addImages = (files) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
        setPreviewImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        addImages(Array.from(e.dataTransfer.files));
    };

    const removeImage = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== "images") data.append(key, formData[key]);
        });
        formData.images.forEach(img => data.append("images", img));

        try {
            setUploading(true);
            await instance.post("/artist/products/", data, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ev) =>
                    setUploadProgress(Math.round((ev.loaded * 100) / ev.total))
            });
            showToast("Product submitted successfully ✅");
            setFormData({ name: "", description: "", cost: "", discount: "", oldprice: "", stock: "", rating: 1, features: "", images: [] });
            setPreviewImages([]);
            setUploadProgress(0);
            setUploading(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            showToast("Upload failed ❌", "error");
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="ad-loader">
            <span className="ad-loader__dot" />
            <span className="ad-loader__dot" />
            <span className="ad-loader__dot" />
        </div>
    );

    return (
        <div className="ad-root">

            {toast && (
                <div className={`ad-toast ${toast.type === "error" ? "ad-toast--error" : ""}`}>
                    {toast.msg}
                </div>
            )}

            {/* ── Two-column layout ── */}
            <div className="ad-layout">

                {/* ════ LEFT COLUMN — Form ════ */}
                <div className="ad-col ad-col--form">

                    <header className="ad-header">
                        <p className="ad-header__mark">A—</p>
                        <h1 className="ad-header__title">
                            Artist<br />Dashboard
                        </h1>
                        <p className="ad-header__sub">Manage & submit your work for review.</p>
                    </header>

                    <section className="ad-section">
                        <div className="ad-section__label">01 — New Submission</div>

                        <form onSubmit={handleSubmit} className="ad-form">

                            <div className="ad-field ad-field--full">
                                <label className="ad-label">Product Name</label>
                                <input
                                    className="ad-input"
                                    name="name"
                                    placeholder="e.g. Hand-woven Jute Basket"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ad-field ad-field--full">
                                <label className="ad-label">Description</label>
                                <textarea
                                    className="ad-input ad-input--textarea"
                                    name="description"
                                    placeholder="Describe your work..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ad-field">
                                <label className="ad-label">Price (₹)</label>
                                <input className="ad-input" type="number" name="cost" placeholder="0.00" value={formData.cost} onChange={handleChange} required />
                            </div>

                            <div className="ad-field">
                                <label className="ad-label">Old Price (₹)</label>
                                <input className="ad-input" type="number" name="oldprice" placeholder="0.00" value={formData.oldprice} onChange={handleChange} />
                            </div>

                            <div className="ad-field">
                                <label className="ad-label">Discount (%)</label>
                                <input className="ad-input" type="number" name="discount" placeholder="0" value={formData.discount} onChange={handleChange} />
                            </div>

                            <div className="ad-field">
                                <label className="ad-label">Stock</label>
                                <input className="ad-input" type="number" name="stock" placeholder="0" value={formData.stock} onChange={handleChange} required />
                            </div>

                            <div className="ad-field ad-field--full">
                                <label className="ad-label">
                                    Features
                                    <span className="ad-label__hint"> — comma separated</span>
                                </label>
                                <textarea
                                    className="ad-input ad-input--textarea ad-input--sm"
                                    name="features"
                                    placeholder="Handmade, Limited Edition, Signed"
                                    value={formData.features}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="ad-field ad-field--full">
                                <label className="ad-label">Rating</label>
                                <div className="ad-stars">
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            className={`ad-star ${formData.rating >= r ? "ad-star--active" : ""}`}
                                            onClick={() => setFormData(p => ({ ...p, rating: r }))}
                                        >★</button>
                                    ))}
                                </div>
                            </div>

                            <div className="ad-field ad-field--full">
                                <label className="ad-label">Images</label>
                                <div
                                    className={`ad-dropzone ${dragActive ? "ad-dropzone--active" : ""}`}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                >
                                    <span className="ad-dropzone__icon">⊕</span>
                                    <p className="ad-dropzone__text">
                                        Drop images here or{" "}
                                        <label className="ad-dropzone__link">
                                            browse
                                            <input
                                                type="file"
                                                multiple
                                                className="ad-dropzone__file"
                                                onChange={(e) => addImages(Array.from(e.target.files))}
                                            />
                                        </label>
                                    </p>
                                    <p className="ad-dropzone__count">
                                        {formData.images.length > 0
                                            ? `${formData.images.length} file(s) ready`
                                            : "No files selected"}
                                    </p>
                                </div>
                            </div>

                            {previewImages.length > 0 && (
                                <div className="ad-previews">
                                    {previewImages.map((img, i) => (
                                        <div key={i} className="ad-preview">
                                            <img src={img} alt="preview" className="ad-preview__img" />
                                            <button type="button" className="ad-preview__rm" onClick={() => removeImage(i)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {uploading && (
                                <div className="ad-progress">
                                    <div className="ad-progress__bar">
                                        <div className="ad-progress__fill" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <span className="ad-progress__pct">{uploadProgress}%</span>
                                </div>
                            )}

                            <button className="ad-submit" type="submit" disabled={uploading}>
                                {uploading ? "Uploading…" : "Submit for Approval →"}
                            </button>

                        </form>
                    </section>
                </div>

                {/* ════ RIGHT COLUMN — Submissions ════ */}
                <div className="ad-col ad-col--submissions">
                    <div className="ad-sidebar">
                        <div className="ad-section__label">02 — Submissions</div>

                        {/* Summary chips */}
                        <div className="ad-summary">
                            <div className="ad-summary__chip">
                                <span className="ad-summary__num">{products.length}</span>
                                <span className="ad-summary__lbl">Total</span>
                            </div>
                            <div className="ad-summary__chip">
                                <span className="ad-summary__num ad-summary__num--green">
                                    {products.filter(p => p.status === "approved").length}
                                </span>
                                <span className="ad-summary__lbl">Approved</span>
                            </div>
                            <div className="ad-summary__chip">
                                <span className="ad-summary__num ad-summary__num--amber">
                                    {products.filter(p => !p.status || p.status === "pending").length}
                                </span>
                                <span className="ad-summary__lbl">Pending</span>
                            </div>
                            <div className="ad-summary__chip">
                                <span className="ad-summary__num ad-summary__num--red">
                                    {products.filter(p => p.status === "rejected").length}
                                </span>
                                <span className="ad-summary__lbl">Rejected</span>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="ad-empty">
                                <p className="ad-empty__icon">◎</p>
                                <p className="ad-empty__text">No products submitted yet.</p>
                            </div>
                        ) : (
                            <ul className="ad-list">
                                {products.map((product, i) => (
                                    <li key={product.id} className="ad-item">
                                        <span className="ad-item__index">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="ad-item__info">
                                            <span className="ad-item__name">{product.name}</span>
                                            <span className="ad-item__price">₹{product.cost}</span>
                                        </div>
                                        <span className={`ad-badge ad-badge--${product.status || "pending"}`}>
                                            {product.status === "approved" && "Approved"}
                                            {product.status === "rejected" && "Rejected"}
                                            {(!product.status || product.status === "pending") && "Pending"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ArtistDashboard;