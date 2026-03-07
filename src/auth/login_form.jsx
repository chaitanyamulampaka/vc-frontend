// src/pages/Login.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleLogin = async () => {
        try {
            const user = await loginUser(username, password);

            if (user.is_staff) {
                navigate("/admin-dashboard");
            } else if (user.role === "artist") {
                navigate("/artist-dashboard");
            } else {
                navigate("/products");
            }

        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;