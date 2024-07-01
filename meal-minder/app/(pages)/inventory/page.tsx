"use client";
import React from "react";
import Layout from "@/app/components/Layout";
import { useGroceryContext } from "@/context/GroceryContext";

const Inventory = () => {
  const { groceryItems } = useGroceryContext();
  const purchasedItems = groceryItems.filter((item) => item.isPurchased);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Inventory</h1>
        {purchasedItems.length === 0 ? (
          <p>No items purchased yet.</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Added By</th>
              </tr>
            </thead>
            <tbody>
              {purchasedItems.map((item) => (
                <tr key={item.id} className="border-t border-dashed">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">{item.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
