import axios from "axios";

const axiosCommon = axios.create({

  baseURL: import.meta.env.VITE_BACKEND_BASE_URL ||  'https://casino-servers.vercel.app',
  withCredentials: true, 
});


const useAxiosSecure = () => {
  return axiosCommon;
};

export default useAxiosSecure;
