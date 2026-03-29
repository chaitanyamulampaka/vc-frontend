import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh if:
        // - 401 error
        // - request not already retried
        // - NOT login endpoint
        // - NOT refresh endpoint
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/token/" &&
            originalRequest.url !== "/token/refresh/"
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call refresh endpoint
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = response.data.access;

                // Save new access token
                localStorage.setItem("access", newAccessToken);

                // Attach new token
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry original request
                return instance(originalRequest);

            } catch (refreshError) {
                console.log("Refresh token expired. Logging out...");

                // Clear tokens
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                // Let React handle redirect via ProtectedRoute
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;