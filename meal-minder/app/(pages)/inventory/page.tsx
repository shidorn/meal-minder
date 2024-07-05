"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGroceryContext } from "@/context/GroceryContext";
import Pagination from "@/app/components/pagination/Pagination";
import SearchBar from "@/app/components/search-bar/SearchBar";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";
import { string } from "zod";

interface GroceryItem {
  item_id: number;
  item_name: string;
  item_quantity: number;
  item_category: string;
  user: { username: string };
  is_purchased: boolean;
}

const Inventory = () => {
  const router = useRouter();
  const { groceryItems } = useGroceryContext();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [groceryItemsList, setGroceryItemsList] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredItems = groceryItemsList.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (quantity < 2) return "Low";
    if (quantity < 5) return "Average";
    return "High";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">Inventory</h1>
          <div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <p>No items purchased yet.</p>
        ) : (
          <table className="min-w-full mt-10 bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Added By</th>
                <th className="py-2 px-4 text-left">Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.item_id} className="border-t border-dashed">
                  <td className="py-2 px-4">{item.item_name}</td>
                  <td className="py-2 px-4">{item.item_quantity}</td>
                  <td className="py-2 px-4">{item.item_category}</td>
                  <td className="py-2 px-4">{item.user.username}</td>
                  <td className="py-2 px-4">
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

        <div className="absolute bottom-10 left-1/2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
