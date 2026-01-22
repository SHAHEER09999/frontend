import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from "../utils/auth";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
  allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser();

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
