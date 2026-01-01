import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If user -->  NOT logged in -->  redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user -->  logged in -->  render protected content
  return children;
};

export default ProtectedRoute;
