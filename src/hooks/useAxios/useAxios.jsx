import axios from "axios";

const axiosCommon = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_BASE_URL ||  'https://casino-servers.vercel.app',


});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;