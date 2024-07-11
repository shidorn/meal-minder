"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";

interface GroceryItem {
  item_id: number;
  item_name: string;
  item_quantity: number;
  item_category: string;
  user: { username: string };
  is_purchased: boolean;
}

interface InventoryContextType {
  inventory: GroceryItem[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({
  children,
}) => {
  const [inventory, setInventory] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      checkTokenExpiration().catch(console.error);
      setupTokenExpirationCheck();
      const token = getAccessToken();
      if (!token) {
        logout();
        return;
      }

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            "/groceries/item-list-purchased",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        logout();
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <InventoryContext.Provider value={{ inventory }}>
      {loading ? (
        <div className="absolute top-2/4 left-2/4">
          <div className="flex flex-col gap-6 justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="text-lg font-bold">Loading</span>
          </div>
        </div>
      ) : (
        children
      )}
    </InventoryContext.Provider>
  );
};
