"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

interface AuthProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/getUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user profile:", error));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
