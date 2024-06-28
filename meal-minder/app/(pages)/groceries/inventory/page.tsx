"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/app/components/search-bar/SearchBar";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  expiryDate: string;
  stockLevel: "low" | "moderate" | "high";
}

const InventoryPage: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchInventoryItems = async () => {
      setIsLoading(true);
      try {
        const checkedItemsParam = searchParams.get("checkedItems");
        if (checkedItemsParam) {
          const checkedItemsArray: number[] = JSON.parse(checkedItemsParam);
          // Simulate fetching inventory items based on checkedItems
          const fetchedItems: InventoryItem[] = checkedItemsArray.map((id) => ({
            id,
            name: `Item ${id}`,
            quantity: 1,
            category: "Unknown",
            expiryDate: "2024-12-31",
            stockLevel: "moderate",
          }));
          setInventoryItems(fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryItems();
  }, [searchParams]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-row justify-between">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Inventory</h1>
            <Breadcrumbs
              crumbs={[
                { title: "Grocery Lists", href: "/groceries" },
                { title: "Inventory", href: "/groceries/inventory" },
              ]}
            />
          </div>
          <div className="mr-72">
            <SearchBar onSearch={() => {}} />
          </div>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Expiry Date</th>
                <th className="py-2 px-4 text-left">Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td className="border-t border-dashed py-2 px-4">
                    {item.name}
                  </td>
                  <td className="border-t border-dashed py-2 px-4">
                    {item.quantity}
                  </td>
                  <td className="border-t border-dashed py-2 px-4">
                    {item.category}
                  </td>
                  <td className="border-t border-dashed py-2 px-4">
                    {item.expiryDate}
                  </td>
                  <td className="border-t border-dashed py-2 px-4">
                    {item.stockLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        typically, ma display ari ang purchased item gikan sa GroceryItemPage
      </div>
    </Layout>
  );
};

export default InventoryPage;
