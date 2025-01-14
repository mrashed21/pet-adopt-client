import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://server-seven-beta-45.vercel.app",
  withCredentials: true,
});
const useAxiosSecure = () => {
  return axiosInstance;
};
export default useAxiosSecure;
