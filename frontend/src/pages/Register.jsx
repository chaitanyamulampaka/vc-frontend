import { useState } from "react";
import instance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        email: "",
        password: "",
        role: "customer"
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await instance.post("register/", formData);
            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Registration failed");
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {/* 🔥 Role Selection */}
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="customer">Customer</option>
                    <option value="artist">Artist</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;