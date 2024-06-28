"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGroceryContext } from "@/context/GroceryContext";
import Pagination from "@/app/components/pagination/Pagination";
import SearchBar from "@/app/components/search-bar/SearchBar";

const Inventory = () => {
  const router = useRouter();
  const { groceryItems } = useGroceryContext();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
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

  const purchasedItems = groceryItems.filter((item) => item.isPurchased);
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(purchasedItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-4">Inventory</h1>
          <div className="mr-72">
            <SearchBar onSearch={() => {}} />
          </div>
        </div>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};

export default Inventory;
