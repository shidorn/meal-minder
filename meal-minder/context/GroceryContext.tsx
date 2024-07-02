"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  isPurchased: boolean;
}

interface GroceryContextProps {
  groceryItems: GroceryItem[];
  setGroceryItems: React.Dispatch<React.SetStateAction<GroceryItem[]>>;
}

const initialGroceryItems: GroceryItem[] = [
  {
    id: 1,
    name: "Apples",
    quantity: 4,
    category: "Fruit",
    addedBy: "John",
    isPurchased: true,
  },
  {
    id: 2,
    name: "Bread",
    quantity: 2,
    category: "Bakery",
    addedBy: "Jane",
    isPurchased: false,
  },
];

const GroceryContext = createContext<GroceryContextProps | undefined>(
  undefined
);

export const useGroceryContext = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error("useGroceryContext must be used within a GroceryProvider");
  }
  return context;
};

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const [groceryItems, setGroceryItems] =
    useState<GroceryItem[]>(initialGroceryItems);

  return (
    <GroceryContext.Provider value={{ groceryItems, setGroceryItems }}>
      {children}
    </GroceryContext.Provider>
  );
};
