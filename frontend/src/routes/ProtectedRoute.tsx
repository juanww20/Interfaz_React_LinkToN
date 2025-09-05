// src/routes/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, state, checkSession } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!state.user) {
        await checkSession(); // igual que en Vue, valida con backend
      }
      setChecking(false);
    };
    verify();
  }, [state.user, checkSession]);

  if (checking) return <div>Cargando...</div>;

  // 🔐 no autenticado → redirige a login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 🚫 rol incorrecto → redirige a home
  if (requiredRole && state.user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ acceso permitido → renderiza la ruta interna
  return <Outlet />;
};

export default ProtectedRoute;
