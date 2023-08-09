import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { authContext } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { auth, setAuth } = useContext(authContext);

  if (auth.isAuthenticated === false) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
