import axios from 'axios';
// import { getJwtToken } from '../screens/LoginScreen';

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://your-api-server-url.com',
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
//   async (config) => {
//     const token = await getJwtToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;