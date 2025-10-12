// src/utils/api.ts
import axios from "axios";
import { getTokens, saveTokens, clearTokens } from "./storage";

// ✅ 환경변수에서 API 주소 가져오기
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://your-api-server-url.com";

const api = axios.create({
  baseURL: API_URL,
});

// ✅ 요청 인터셉터: access_token 붙이기
api.interceptors.request.use(async (config) => {
  const { access } = await getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// ✅ 응답 인터셉터: 401 → refresh token 재발급
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh } = await getTokens();
      if (!refresh) {
        await clearTokens();
        return Promise.reject(err);
      }

      try {
        // refresh 요청
        const res = await axios.post(`${API_URL}/auth/refresh-token`, {
          refresh_token: refresh,
        });

        const { access_token, refresh_token } = res.data;

        // 새 토큰 저장
        await saveTokens(access_token, refresh_token);

        // 요청 헤더 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (e) {
        await clearTokens();
      }
    }

    return Promise.reject(err);
  }
);

export default api;
