import { useEffect, useState } from "react";
import instance from "../services/axiosInstance";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await instance.get("/admin/artist-products/");
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const approveProduct = async (id) => {
        try {
            await instance.post(`/admin/artist-products/${id}/approve/`);
            alert("Product Approved ✅");
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const rejectProduct = async (id) => {
        try {
            await instance.post(`/admin/artist-products/${id}/reject/`);
            alert("Product Rejected ❌");
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: "30px" }}>
            <h2>Admin Dashboard</h2>

            {products.length === 0 && <p>No submissions.</p>}

            {products.map((product) => (
                <div
                    key={product.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "15px",
                        borderRadius: "8px"
                    }}
                >
                    <h3>{product.name}</h3>
                    <p>₹ {product.cost}</p>
                    <p>Artist ID: {product.artist}</p>
                    <p>Status: {product.status}</p>

                    {product.status === "pending" && (
                        <div>
                            <button
                                onClick={() => approveProduct(product.id)}
                                style={{
                                    marginRight: "10px",
                                    backgroundColor: "green",
                                    color: "white"
                                }}
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => rejectProduct(product.id)}
                                style={{
                                    backgroundColor: "red",
                                    color: "white"
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;