import axios from "axios";

const instance = axios.create({
    baseURL: "https://vc-backend-phpt.onrender.com/api/",
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/token/" &&
            originalRequest.url !== "/api/token/refresh/"
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");

                const response = await axios.post(
                    "https://vc-backend-phpt.onrender.com/api/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = response.data.access;

                localStorage.setItem("access", newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return instance(originalRequest);

            } catch (err) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;