import React from "react";
import { Link, useLocation } from "react-router";

const Breadcrumbs = ({ breadcrumbMenu }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  console.log(breadcrumbMenu);

  return (
    <nav className="text-sm my-4">
      <ul className="flex space-x-2">
        {breadcrumbMenu.map((value, index) => {
          const isLast = index === breadcrumbMenu.length - 1; // เช็คว่าตัวสุดท้ายหรือไม่

          return (
            <li key={value.link} className="flex items-center">
              {isLast ? (
                <span className="">{value.name}</span>
              ) : (
                <>
                  <Link
                    to={value.link}
                    className="text-black/35 hover:underline"
                  >
                    {value.name}
                  </Link>
                  <span className="mx-1"> / </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
