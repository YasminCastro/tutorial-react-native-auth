import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; isAuth: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "https://api.developbetterapps.com";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, seAuthState] = useState<{
    token: string | null;
    isAuth: boolean;
  }>({ token: null, isAuth: false });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      console.log("TOKEN:", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        seAuthState({ token, isAuth: true });
      }
    };

    loadToken();
  }, []);

  const onRegister = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/users`, { email, password });
    } catch (error: any) {
      return { error: true, message: error.response.data.msg };
    }
  };

  const onLogin = async (email: string, password: string) => {
    try {
      const { data: loginResponse } = await axios.post(`${API_URL}/auth`, {
        email,
        password,
      });

      seAuthState({ token: loginResponse.token, isAuth: true });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginResponse.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, loginResponse.token);

      return loginResponse;
    } catch (error: any) {
      return { error: true, message: error.response.data.msg };
    }
  };

  const onLogout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = ``;

    seAuthState({ token: null, isAuth: false });

    return;
  };

  const value = { onRegister, onLogin, onLogout, authState };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
