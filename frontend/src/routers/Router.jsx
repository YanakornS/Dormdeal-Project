import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout/Main";
import ModLayout from "../layouts/ModLayout/ModLayout";

import AddProduct from "../pages/PostProduct/Index";
import Home from "../pages/Home/Index";
import ShoppingPost from "../pages/ShoppiongPost/Index";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

import ManagePostsByMod from "../pages/ModPages/ManagePostsByMod";

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
    ],
  },
  {
    path: "/mod",
    element: <ModLayout />,
    children: [
      {
        path: "",
        element: <ManagePostsByMod />,
      },
    ],
  },
]);

export default router;
