import ShoppingCart from "../../components/ShoppingCart";
import Categories from "../../components/Categories";
import Breadcrumbs from "../../components/Breadcrumb";

  const breadcrumbMenu = [
    {name: "หน้าแรก",link: "/"},
    {name: "โพสต์",link: "#"},
  ]


const Index = () => {
  return (
    <>
    {/* <div className="section-container mt-18">
    <Breadcrumbs breadcrumbMenu={breadcrumbMenu}/>
    </div> */}
    <Categories />
      <ShoppingCart />
    </>
    
  );
};

export default Index;
