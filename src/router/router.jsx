import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../pages/layout/Layout";
import Users from "@/pages/users/Users";

import DepositPage from "./../pages/deposit/Deposit";


const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout/> ,
    errorElement: <h3>error page</h3>,
    children: [
        {
            index:true,
            element:<Home/>
        },
        {
            path:'/users',
            element:<Users/>
        },
        {
            path:'/deposit-requests',
            element:<DepositPage/>
        },
    ],
  },

]);

export default router;