import React from "react";
import { Link, useLocation } from "react-router";

const Breadcrumbs = ({breadcrumbMenu}) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
    console.log(breadcrumbMenu);
    
  return (
    <nav className="text-sm text-gray-500 my-4">
      <ul className="flex space-x-2">
       {breadcrumbMenu.map((value, index) => {
          const isLast = index === breadcrumbMenu.length - 1; // เช็คว่าตัวสุดท้ายหรือไม่

          return (
            <li key={value.link} className="flex items-center">
              {isLast ? (
                <span className="text-gray-700">{value.name}</span>
              ) : (
                <>
                  <Link to={value.link} className="text-black/35 hover:underline">
                    {value.name}
                  </Link>
                  <span className="mx-1"> / </span>
                </>
              )}
            </li>
          );
        })}
       
        {/* <li>
          <Link to="/" className="text-blue-500 hover:underline">หน้าแรก</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-700">{name}</span>
              ) : (
                <Link to={to} className="text-blue-500 hover:underline">
                  {decodeURIComponent(value)}
                </Link>
              )}
            </li>
          );
        })} */}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;