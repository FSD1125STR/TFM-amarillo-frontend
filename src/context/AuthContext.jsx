import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";
import { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [token, setToken] = useState(() => localStorage.getItem("token"));
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   const fetchMe = async (currentToken) => {
      if (!currentToken) {return null;}

      setAuthToken(currentToken);
      const response = await authService.getMe();
      const userData = response?.data || response;
      setUser(userData);
      return userData;
   };

   const login = async ({ email, password, loginType }) => {
      const response = await authService.login({ email, password, loginType });
      const newToken = response.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setAuthToken(newToken);

      await fetchMe(newToken);
      return response;
   };

   const register = async (payload) => {
      const response = await authService.register(payload);
      const newToken = response.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setAuthToken(newToken);

      await fetchMe(newToken);
      return response;
   };

   const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setAuthToken(null);
   };

   const refreshUser = async () => {
      if (!token) {return null;}
      return fetchMe(token);
   };

   useEffect(() => {
      const initAuth = async () => {
         try {
            if (token) {
               await fetchMe(token);
            }
         } catch (error) {
            logout();
         } finally {
            setLoading(false);
         }
      };

      initAuth();
   }, []);

   const value = useMemo(
      () => ({
         user,
         token,
         loading,
         isAuthenticated: !!user,
         login,
         register,
         logout,
         refreshUser,
      }),
      [user, token, loading]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth debe usarse dentro de AuthProvider");
   }

   return context;
}
