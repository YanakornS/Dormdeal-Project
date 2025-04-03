import { Outlet } from "react-router";
import NavbarMod from "../../components/ModComponents/NavbarMod";
import Footer from "../../components/Footer";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMod />
      <div className="flex-grow pt-[height-of-navbar]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
