// src/store/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { userService } from "../services/project_2/userService";

// Tipado del usuario
interface User {
  user_id: string;
  user_name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
};

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}>({
  state: initialState,
  login: async () => false,
  logout: async () => {},
  checkSession: async () => false,
  isAuthenticated: false,
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Métodos equivalentes a "actions" de Pinia
  const login = async (data: { email: string; password: string }) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await userService.login(data);

      if (res && res.status) {
        const user: User = {
          ...res.data,
          role: res.data.role?.name || res.data.role,
        };
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: user });
        return true;
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
    return false;
  };

  const logout = async () => {
    await userService.logout();
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const checkSession = async () => {
    try {
      const res = await userService.getSectionId();
      if (res && res.status) {
        const user: User = {
          ...res.data,
          role: res.data.role?.name || res.data.role,
        };
        dispatch({ type: "LOGIN", payload: user });
        return true;
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (err) {
      console.error("Session check error:", err);
      dispatch({ type: "LOGOUT" });
    }
    return false;
  };

  const value = {
    state,
    login,
    logout,
    checkSession,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
