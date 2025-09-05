import React, { useState } from "react";
import InputField from "./InputField";

function AuthForm({ isLoginMode, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showError, setShowError] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(true);

    const isValid =
      formData.email &&
      validEmail &&
      formData.password.length >= 6 &&
      (isLoginMode ||
        (formData.user_name && formData.confirmPassword === formData.password));

    if (!isValid) return;

    onSubmit(formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {!isLoginMode && (
        <InputField
          label="UserName"
          name="user_name"
          type="text"
          required
          value={formData.user_name}
          onChange={handleChange}
          error={showError && !formData.user_name}
          errorMessage="El nombre es requerido."
        />
      )}

      <InputField
        label="Email"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        error={showError && !validEmail}
        errorMessage="Correo inválido o vacío."
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        error={showError && formData.password.length < 6}
        errorMessage="La contraseña debe tener al menos 6 caracteres."
      />

      {!isLoginMode && (
        <InputField
          label="Confirmar"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={
            showError &&
            (!formData.confirmPassword ||
              formData.confirmPassword !== formData.password)
          }
          errorMessage="Las contraseñas no coinciden."
        />
      )}

      <button type="submit" className="auth-button" disabled={loading} style={{ color: "var(--ligth-color)" }}>
        {loading ? "Procesando..." : isLoginMode ? "Iniciar Sesión" : "Registrarse"}
      </button>
    </form>
  );
}

export default AuthForm;
