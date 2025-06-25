import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../../context/AuthContext";


const UserProtectPage = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
      
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/NotAllowed" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectPage;
