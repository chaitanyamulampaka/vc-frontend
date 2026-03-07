import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";

function ArtistDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    // Fetch products
    const fetchProducts = async () => {
        try {
            const res = await instance.get("/artist/products/");
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add images
    const addImages = (files) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    // Drag drop
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Remove image
    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Normal input change
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach(key => {
            if (key !== "images") {
                data.append(key, formData[key]);
            }
        });

        formData.images.forEach(image => {
            data.append("images", image);
        });

        try {
            setUploading(true);

            await instance.post("/artist/products/", data, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percent);
                }
            });

            alert("Product submitted successfully ✅");

            setFormData({
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

            setPreviewImages([]);
            setUploadProgress(0);
            setUploading(false);

            fetchProducts();

        } catch (err) {
            console.error(err);
            console.log("FULL ERROR:", err.response.data);
            alert("Upload failed ❌");

            setUploading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
            <h2>🎨 Artist Dashboard</h2>

            <h3>Upload New Product</h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />

                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

                <input type="number" name="cost" placeholder="Price" value={formData.cost} onChange={handleChange} required />

                <input type="number" name="discount" placeholder="Discount" value={formData.discount} onChange={handleChange} />

                <input type="number" name="oldprice" placeholder="Old Price" value={formData.oldprice} onChange={handleChange} />

                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />

                <select name="rating" value={formData.rating} onChange={handleChange}>
                    {[1,2,3,4,5].map(r => (
                        <option key={r} value={r}>{r} Star</option>
                    ))}
                </select>

                <textarea name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleChange} />

                {/* Drag & Drop */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        border: "2px dashed #aaa",
                        padding: "30px",
                        textAlign: "center",
                        borderRadius: "10px",
                        cursor: "pointer"
                    }}
                >
                    <p>Drag & Drop Images Here</p>
                    <p>OR</p>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => addImages(Array.from(e.target.files))}
                    />
                    <p>
                        {formData.images.length > 0
                            ? `${formData.images.length} file(s) selected`
                            : "No files selected"}
                    </p>
                </div>

                {/* Preview */}
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    {previewImages.map((img, index) => (
                        <div key={index} style={{ position: "relative" }}>
                            <img
                                src={img}
                                width="120"
                                style={{ borderRadius: "8px", border: "1px solid #ddd" }}
                                alt="preview"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "25px",
                                    height: "25px",
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        padding: "12px",
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                >
                    {uploading ? "Uploading..." : "Submit for Approval"}
                </button>

                {/* Progress Bar */}
                {uploading && (
                    <div style={{ marginTop: "10px" }}>
                        <div style={{
                            height: "10px",
                            background: "#eee",
                            borderRadius: "5px"
                        }}>
                            <div style={{
                                width: `${uploadProgress}%`,
                                height: "10px",
                                background: "green",
                                borderRadius: "5px",
                                transition: "0.3s"
                            }} />
                        </div>
                        <p>{uploadProgress}% Uploaded</p>
                    </div>
                )}
            </form>

            <hr style={{ margin: "40px 0" }} />

            <h3>Your Submitted Products</h3>

            {products.length === 0 && <p>No products submitted yet.</p>}

            {products.map(product => (
                <div key={product.id} style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "5px"
                }}>
                    <h4>{product.name}</h4>
                    <p>₹ {product.cost}</p>
                    <p>Status:
                        <strong style={{
                            color:
                                product.status === "approved"
                                    ? "green"
                                    : product.status === "rejected"
                                    ? "red"
                                    : "orange"
                        }}>
                            {" "}{product.status}
                        </strong>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ArtistDashboard;