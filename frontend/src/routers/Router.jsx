import { createBrowserRouter } from "react-router";


// import MainLayout from "../layouts/MainLayout/Main";
// import ModLayout from "../layouts/ModLayout/ModLayout";
// import AddProduct from "../pages/PostProduct/Index";
// import PaymentPage from "../pages/PostProduct/PaymentPage";
// import Home from "../pages/Home/Index";
// import ShoppingPost from "../pages/ShoppiongPost/Index";
// import ProductDetail from "../pages/ProductDetail/ProductDetail";
// import Chat from "../pages/Chat/Home";
// import ManagePosts from "../pages/UserPages/ManagePosts/Index";
// import ManagePostsByMod from "../pages/ModPages/ManagePostsByMod";
// import ManagePostStatus from "../pages/UserPages/ManagePostStatus";
// import ApprovePosts from "../pages/ModPages/ApprovePosts/ApprovePosts";
// import ModRoute from "../pages/ProtectPage/ModRoute";
// import AdminRoute from "../pages/ProtectPage/AdminRoute";
// import UserProtectPage from "../pages/ProtectPage/UserProtectPage";
// import NotAllowed from "../pages/ProtectPage/NotAllowed";
// import Wishlists from "../pages/UserPages/Wishlists";
// import Profile from "../pages/UserPages/Profile";
// import ModLogin from "../components/Login/ModLogin";
// import ModRegister from "../components/Login/ModRegister";
// import LoginProtect from "../pages/ProtectPage/LoginProtect";
// import NotAllowedAdmin from "../pages/ProtectPage/NotAllowedAdmin";
// import NotAllowedMod from "../pages/ProtectPage/NotAllowedMod";
// import ReportPosts from "../pages/ModPages/ReportPosts/ReportPosts";
// import ManageCategories from "../pages/ModPages/MenageCategories/ManageCategories";
// import UpdatePostProduct from "../pages/UserPages/UpdatePost/UpdatePostProduct";
// import TermOfService from "../components/TermOfService";
// import TermOfServiceModal from "../components/TermOfServiceModal";
// import AdminProfileMenu from "../components/AdminComponents/AdminProfileMenu";
// import AdminLayout from "../layouts/AdminLayout/AdminLayout";
// import ManagePermissions from "../pages/AdminPages/ManagePermissions";
// import ManageStatuses from './../pages/AdminPages/ManageStatuses';

// Lazy loadingLottie
import { lazy } from "react";
const MainLayout = lazy(() => import("../layouts/MainLayout/Main"));
const ModLayout = lazy(() => import("../layouts/ModLayout/ModLayout"));
const Home = lazy(() => import("../pages/Home/Index"));
const AddProduct = lazy(() => import("../pages/PostProduct/Index"));
const PaymentPage = lazy(() => import("../pages/PostProduct/PaymentPage"));
const ShoppingPost = lazy(() => import("../pages/ShoppiongPost/Index"));
const ProductDetail = lazy(() => import("../pages/ProductDetail/ProductDetail"));
const Chat = lazy(() => import("../pages/Chat/Home"));
const ManagePosts = lazy(() => import("../pages/UserPages/ManagePosts/Index"));
const ManagePostsByMod = lazy(() => import("../pages/ModPages/ManagePostsByMod"));
const ManagePostStatus = lazy(() => import("../pages/UserPages/ManagePostStatus"));
const ApprovePosts = lazy(() => import("../pages/ModPages/ApprovePosts/ApprovePosts"));
const ModRoute = lazy(() => import("../pages/ProtectPage/ModRoute"));
const AdminRoute = lazy(() => import("../pages/ProtectPage/AdminRoute"));
const UserProtectPage = lazy(() => import("../pages/ProtectPage/UserProtectPage"));
const NotAllowed = lazy(() => import("../pages/ProtectPage/NotAllowed"));
const NotAllowedAdmin = lazy(() => import("../pages/ProtectPage/NotAllowedAdmin"));
const NotAllowedMod = lazy(() => import("../pages/ProtectPage/NotAllowedMod"));
const Wishlists = lazy(() => import("../pages/UserPages/Wishlists"));
const Profile = lazy(() => import("../pages/UserPages/Profile"));
const ModLogin = lazy(() => import("../components/Login/ModLogin"));
const ModRegister = lazy(() => import("../components/Login/ModRegister"));
const LoginProtect = lazy(() => import("../pages/ProtectPage/LoginProtect"));
const ReportPosts = lazy(() => import("../pages/ModPages/ReportPosts/ReportPosts"));
const ManageCategories = lazy(() => import("../pages/ModPages/MenageCategories/ManageCategories"));
const UpdatePostProduct = lazy(() => import("../pages/UserPages/UpdatePost/UpdatePostProduct"));
const TermOfService = lazy(() => import("../components/TermOfService"));
const TermOfServiceModal = lazy(() => import("../components/TermOfServiceModal"));
const AdminProfileMenu = lazy(() => import("../components/AdminComponents/AdminProfileMenu"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout/AdminLayout"));
const ManagePermissions = lazy(() => import("../pages/AdminPages/ManagePermissions"));
const ManageStatuses = lazy(() => import("../pages/AdminPages/ManageStatuses"));




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
        path: "/payment/:postId",
        element:<UserProtectPage><PaymentPage /></UserProtectPage>,
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
        path: "/notallowedadmin",
        element: <NotAllowedAdmin />,
      },
      {
        path: "/notallowedmod",
        element: <NotAllowedMod />,
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
       {
        path: "/login",
        element:<LoginProtect> <ModLogin /> </LoginProtect>  ,
      },
      
    ],
  },

  {
    path: "/mod",
    element: (
      <ModRoute>
        {" "}
        <ModLayout />{" "}
      </ModRoute>
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
       {
         path: "/mod/register",
        element: <ModRegister />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout/>
      </AdminRoute>
    ),
    children: [
       {
         path: "/admin/register",
        element: <ModRegister />,
      },
      {
        path: "",
        element: <ManagePermissions />,
      },
      {
        path: "manage-permission",
        element: <ManagePermissions />,
      },
      {
        path: "manage-status",
        element: <ManageStatuses />,
      },
    ],
  },
]);

export default router;
