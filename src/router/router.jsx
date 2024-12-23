import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../pages/layout/Layout";
import Users from "@/pages/users/Users";

import DepositPage from "./../pages/deposit/Deposit";
import WithdrawPage from "@/pages/withdraw/Withdraw";
import LoginPage from "@/pages/login/LoginPage";

import AccountManagementPage from './../pages/content/AccountManagement';


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
            path:'/add-peyment',
            element:<AccountManagementPage/>
        },
        {
            path:'/deposit-requests',
            element:<DepositPage/>
        },
        {
            path:'/withdrawal-requests',
            element:<WithdrawPage/>
        },
    ],
  },
  {
    path:'/login',
    element:<LoginPage/>
  }

]);

export default router;