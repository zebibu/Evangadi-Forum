import axios from "axios";
const instance = axios.create({
  // baseURL: import.meta.env.VITE_REMOTE_API_BASE_URL,
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
export default instance;
