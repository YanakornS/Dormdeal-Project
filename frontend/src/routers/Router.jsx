import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout/Main";
import ModLayout from "../layouts/ModLayout/ModLayout";

import AddProduct from "../pages/PostProduct/Index";
import Home from "../pages/Home/Index";
import ShoppingPost from "../pages/ShoppiongPost/Index";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Chat from "../pages/Chat/Home";
import ManagePosts from "../pages/UserPages/ManagePosts/Index";
import ManagePostsByMod from "../pages/ModPages/ManagePostsByMod";
import ManagePostStatus from "../pages/UserPages/ManagePostStatus";
import ApprovePosts from "../pages/ModPages/ApprovePosts/ApprovePosts";
import AdminRoute from "../pages/ProtectPage/AdminRouter";
import UserProtectPage from "../pages/ProtectPage/UserProtectPage";
import NotAllowed from "../pages/ProtectPage/NotAllowed";
import Wishlists from "../pages/UserPages/Wishlists";
import Profile from "../pages/UserPages/Profile";

import ReportPosts from "../pages/ModPages/ReportPosts/ReportPosts";
import ManageCategories from "../pages/ModPages/MenageCategories/ManageCategories";
import UpdatePostProduct from "../pages/UserPages/UpdatePost/UpdatePostProduct";
import TermOfService from "../components/TermOfService";
import TermOfServiceModal from "../components/TermOfServiceModal";

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
        element:<UserProtectPage><AddProduct /></UserProtectPage> ,
      },
      {
        path: "/chat",
        element: <UserProtectPage><Chat /></UserProtectPage> ,
      },
      {
        path: "/ManagePost/:id",
        element: <ManagePosts />,
      },
      {
        path: "/ManagePostStatus",
        element:<UserProtectPage><ManagePostStatus /></UserProtectPage> ,
      },
      {
        path: "/notallowed",
        element: <NotAllowed />,
      },
      {
        path: "/profile",
        element: <UserProtectPage> <Profile /> </UserProtectPage> ,
      },
      {
        path: "/wishlish",
        element: <UserProtectPage><Wishlists /></UserProtectPage>,
      },
      {
        path: "/updatepost/:id",
        element:<UserProtectPage><UpdatePostProduct /></UserProtectPage> ,
      },
      {
        path: "/termofservice",
        element: <TermOfService />,
      },
      {
        path: "/termofservicemodal",
        element: <TermOfServiceModal />,
      },
    ],
  },
  {
    path: "/mod",
    element: (
      <AdminRoute>
        {" "}
        <ModLayout />{" "}
      </AdminRoute>
    ),
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
        element: <ReportPosts />,
      },
      {
        path: "/mod/managecategories",
        element: <ManageCategories />,
      },
    ],
  },
]);

export default router;
