import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;

    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" />; 
    }

    return children;
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
