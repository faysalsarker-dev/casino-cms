import { ContextData } from "@/utility/ContextData";
import { useContext } from "react";



const useAuth = () => {
  const auth = useContext(ContextData);
  return auth;
};

export default useAuth;