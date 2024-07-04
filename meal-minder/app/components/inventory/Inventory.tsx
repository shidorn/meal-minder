"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGroceryContext } from "@/context/GroceryContext";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";
import Pagination from "../pagination/Pagination";

interface GroceryItem {
  item_id: number;
  item_name: string;
  item_quantity: number;
  item_category: string;
  user: { username: string };
  is_purchased: boolean;
}

const Inventory: React.FC = () => {
  const router = useRouter();
  const { groceryItems } = useGroceryContext();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [groceryItemsList, setGroceryItemsList] = useState<GroceryItem[]>([]);

  useEffect(() => {
    checkTokenExpiration().catch(console.error);
    setupTokenExpirationCheck();
    const token = getAccessToken();
    if (!token) {
      logout(); // Redirect to login if no token is available
      return;
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.log(error);
        // logout(); // Redirect to login if no token is available
        return;
      });

    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            "/groceries/item-list-purchased",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        const respData: GroceryItem[] = response.data;
        const uniqueGroceryItems = new Set(
          groceryItemsList.map((item) => item.item_id)
        );
        respData.forEach((item) => {
          if (!uniqueGroceryItems.has(item.item_id)) {
            groceryItemsList.push(item);
          }
        });
        setGroceryItemsList((groceryItemsList) => [...groceryItemsList]);
        console.log(groceryItemsList);
        setLoading(false);
      } catch (error) {
        console.log(error);
        logout(); // Redirect to login if no token is available
        return;
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (loading) {
    return (
      <div className="absolute top-2/4 left-2/4">
        <div className="flex flex-col gap-6 justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <span className="text-lg font-bold">Loading</span>
        </div>
      </div>
    );
  }

  const getStockLevel = (quantity: number): string => {
    if (quantity < 10) return "Low";
    if (quantity < 50) return "Average";
    return "High";
  };

  const purchasedItems = groceryItemsList;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(purchasedItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container flex flex-col mx-auto p-4">
      <div className="mb-4 self-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {purchasedItems.length === 0 ? (
        <p>No items purchased yet.</p>
      ) : (
        <table className="min-w-full overflow-hidden mb-4">
          <thead className="">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.item_id} className="border-t border-dashed">
                <td className="py-2 px-4">{item.item_name}</td>
                <td className="py-2 px-4">{item.item_quantity}</td>
                <td className="py-2 px-4">{item.item_category}</td>
                <td className="py-3">
                  <div
                    className={`py-2 px-4 text-white w-28 rounded-full text-center ${
                      getStockLevel(item.item_quantity) === "Low"
                        ? "bg-red-600"
                        : getStockLevel(item.item_quantity) === "Average"
                        ? "bg-yellow-600"
                        : "bg-green-700"
                    }`}
                  >
                    {getStockLevel(item.item_quantity)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
