import axios from "axios";
import instance from "./axiosInstance";

const API_URL = "https://vc-backend-phpt.onrender.com/api";

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/token/`, {
        username,
        password
    });

    if (response.data.access) {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
    }

    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

export const getCurrentUser = async () => {
    const response = await instance.get("/me/");
    return response.data;
};