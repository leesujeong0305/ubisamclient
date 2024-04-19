import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: `http://14.58.108.70:8877`
});

api.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
            // 리프레시 토큰으로 새 액세스 토큰을 요청합니다.
            const response = await axios.post(`${ip}/refresh`, {
                refreshToken
            });

            if (response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);

                // 새 액세스 토큰으로 원래 요청을 다시 시도합니다.
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);


export default api;