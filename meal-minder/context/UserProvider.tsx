"use client";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  user_id: string;
  name: string;
  profileImage: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserDataFromAPI();
      console.log(userData);
      setUser(userData);
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  // console.log(UserContext);
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const getUserDataFromAPI = async (): Promise<User> => {
  const email = {
    userEmail: localStorage.getItem("email"),
  };
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/getUser",
    email
  );
  console.log(response.data.username);
  localStorage.setItem("user_name", response.data.username);
  return {
    user_id: response.data.user_id,
    name: response.data.username,
    profileImage: "/images/unnamed.jpg",
  };
};
