import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url?.includes("/user/refresh")) {
            localStorage.removeItem("user-storage");
            window.location.href = "/admin/login";
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            (error.response?.data?.error === "token_expired" ||
                error.response?.data?.error === "access_token_missing") &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await instance.post("/user/refresh");
                return instance(originalRequest);
            } catch (err: unknown) {
                localStorage.removeItem("user-storage");
                window.location.href = "/admin/login";
                return Promise.reject(err);
            }
        }
    }
);

export default instance;
