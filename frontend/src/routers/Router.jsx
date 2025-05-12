import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout/Main";
import ModLayout from "../layouts/ModLayout/ModLayout";

import AddProduct from "../pages/PostProduct/Index";
import Home from "../pages/Home/Index";
import ShoppingPost from "../pages/ShoppiongPost/Index";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ManagePosts from "../pages/UserPages/ManagePosts/Index";
import ManagePostsByMod from "../pages/ModPages/ManagePostsByMod";
import ManagePostStatus from "../pages/UserPages/ManagePostStatus";
import ApprovePosts from "../pages/ModPages/ApprovePosts/ApprovePosts";
import AdminRoute from "../pages/ProtectPage/AdminRouter";
import NotAllowed from "../pages/ProtectPage/NotAllowed";
import Wishlists from "../pages/UserPages/Wishlists";
import Profile from "../pages/UserPages/Profile"

import ReportPosts from "../pages/ModPages/ReportPosts/ReportPosts";
import ManageCategories from "../pages/ModPages/MenageCategories/ManageCategories";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shoppingpost",
        element: <ShoppingPost />,
      },
      {
        path: "/postproductdetail/:id",
        element: <ProductDetail />,
      },
      {
        path: "/post",
        element: <AddProduct />,
      },
      {
        path: "/ManagePost/:id",
        element: <ManagePosts />,
      },
      {
        path: "/ManagePostStatus",
        element: <ManagePostStatus />,
      },
      {
        path: "/notallowed",
        element: <NotAllowed />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/wishlish",
        element: <Wishlists />,
      }
      
      
    ],
  },
  {
    path: "/mod",
    element: <AdminRoute> <ModLayout /> </AdminRoute>,
    children: [
      {
        path: "",
        element: <ManagePostsByMod />,
      },
      {
        path: "approveposts/:id", 
        element: <ApprovePosts />,
      },
      {
        path: "/mod/reportpost",
        element: <ReportPosts />
      },
      {
        path: "/mod/managecategories",
        element: <ManageCategories/>
      }
    ],
  },
]);

export default router;
