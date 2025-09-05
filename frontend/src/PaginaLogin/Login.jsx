import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import { userService } from "../services/project_2/userService"; // adapta la ruta
import { useAuth } from "../store/AuthContext"; // tu contexto de auth

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, state } = useAuth();

  const toggleMode = () => setIsLoginMode((prev) => !prev);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (!isLoginMode) {
        // Registro
        const { user_name, email, password } = formData;
        const res = await userService.createUser({ user_name, email, password });

        if (res) {
          await Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Ahora puedes iniciar sesión.",
            confirmButtonColor: "#3085d6",
          });
          setIsLoginMode(true);
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear el usuario. Inténtalo de nuevo.",
            confirmButtonColor: "#d33",
          });
        }
      } else {
        // Login
        
        const success = await login({ email: formData.email, password: formData.password });
        
        if (success) {
          await Swal.fire({
            icon: "success",
            title: "Inicio de sesión exitoso",
            text: `Bienvenido de nuevo ${state.user?.user_name ?? "usuario"}.`,
            confirmButtonColor: "#3085d6",
          });
          navigate("/");
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Credenciales incorrectas. Inténtalo de nuevo.",
            confirmButtonColor: "#d33",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 style={{ fontFamily: "var(--font-principal)" }}>
            {isLoginMode ? "Iniciar Sesión" : "Registrarse"}
          </h1>
        </div>

        <div className="mode-toggle">
          <button
            type="button"
            className={`toggle-button ${isLoginMode ? "active" : ""}`}
            onClick={toggleMode}
            style={{ fontFamily: "var(--font-secundary)" }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`toggle-button ${!isLoginMode ? "active" : ""}`}
            onClick={toggleMode}
            style={{ fontFamily: "var(--font-secundary)" }}
          >
            Registrarse
          </button>
        </div>

        <AuthForm isLoginMode={isLoginMode} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

export default Login;
