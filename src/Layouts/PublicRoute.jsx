// Layouts/PublicRoute.js
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { BioContext } from '../context/authContext'

export  const PublicRoute = () => {
  const  {isLogin}  = useContext(BioContext);



  return !isLogin ? <Outlet /> : <Navigate to="/dashboard" />;
};

// export default PublicRoute;
