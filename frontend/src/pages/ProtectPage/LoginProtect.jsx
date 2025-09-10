import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const ProtectPage = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        
      </div>
    );
  }

  
  if (user) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectPage;
