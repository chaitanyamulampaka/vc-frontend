// src/context/AuthContext.js

import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Load user when app starts
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("access");
                if (token) {
                    const data = await getCurrentUser();
                    setUser(data);
                }
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // 🔥 Login function inside context
    const loginUser = async (username, password) => {
        await login(username, password);
        const data = await getCurrentUser();
        setUser(data);   // ✅ CRITICAL FIX
        return data;
    };

    const logoutUser = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, loginUser, logoutUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);