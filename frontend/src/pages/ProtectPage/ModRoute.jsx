import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const ModRoute = ({ children }) => {
  const { user, isLoading, getUser } = useContext(AuthContext);
  const location = useLocation();
  const userInfo = getUser();

  if (isLoading) {
    return <div></div>;
  }

  if (user && (userInfo.role === "mod" || userInfo.role === "admin" )) {
    return children;
  }

  return <Navigate to="/notallowedmod" state={{ from: location }} replace />;
};

export default ModRoute;
