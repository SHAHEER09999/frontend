import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }: any) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;