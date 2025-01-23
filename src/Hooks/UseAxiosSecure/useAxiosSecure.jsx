import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  // const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    //
    axiosSecure.interceptors.request.use(
      (req) => {
        if (localStorage.getItem("token")) {
          req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        }
        return req;
      },
      (err) => Promise.reject(err)
    );

    //
    axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        // console.log("Error caught from axios interceptor-->", error.response);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // logout
          // logOut.logOut();
          logout();
          // navigate to login
          // navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logout]);
  return axiosSecure;
};
export default useAxiosSecure;
