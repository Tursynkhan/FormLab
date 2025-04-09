import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import AuthContext from "../context/AuthProvider";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/User";
import { AuthData } from "../types/User";
import ApiClient from "../api/axios";

const useAuth = () => {
  const context = useContext(AuthContext);
  const { auth, setAuth } = context;
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      setAccessToken(token);
      setAuth((prev) => ({
        ...prev,
        accessToken: token,
      }));

      try {
        const decoded = jwtDecode<User>(token);
        setAuth((prev) => ({
          ...prev,
          user: decoded,
        }));
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [setAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const response = await ApiClient.loginUser({ email, password });
        const { accessToken } = response.data.data;

        Cookies.set("accessToken", accessToken, {
          expires: 1 / 1440, // 1 minute
          secure: true,
        });
        setAccessToken(accessToken);
        const decodedUser = jwtDecode<User>(accessToken);
        setAuth((prev: AuthData) => ({
          ...prev,
          accessToken: accessToken,
          user: decodedUser,
        }));
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [setAuth]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await ApiClient.logoutUser();
      Cookies.remove("accessToken");
      setAccessToken(null);
      setAuth({ accessToken: null, refreshToken: null, user: null });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [setAuth]);

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<void> => {
      try {
        const response = await ApiClient.registerUser({
          username,
          email,
          password,
        });
        console.log("Registration successful:", response.data);
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    []
  );
  return useMemo(
    () => ({ auth, accessToken, login, register, logout }),
    [auth, accessToken, login, register, logout]
  );
};

export default useAuth;
