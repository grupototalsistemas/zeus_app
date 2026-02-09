import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // exemplo para Next.js
  timeout: 10000,
  withCredentials: true,
});

// const socket = io(process.env.NEXT_PUBLIC_API_URL, {
//   withCredentials: true,
// });
export default api;
// export { socket };
