"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import Modal from "@/app/components/modal/Modal";
import axios from "axios";
import Pagination from "@/app/components/pagination/Pagination";
import SearchBar from "@/app/components/search-bar/SearchBar"; // Import SearchBar component

interface GroceryList {
  grocery_id: number;
  grocery_name: string;
  target_date: string;
  status: "Pending" | "Done";
}

const groceryListForm = {
  grocery_name: "",
  target_date: "",
};

const GroceryLists = () => {
  const router = useRouter();
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [filteredLists, setFilteredLists] = useState<GroceryList[]>([]); // State for filtered lists
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/groceries/grocery-list",
          config
        );
        setGroceryLists(response.data);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState(groceryListForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setFormData(groceryListForm);
    setEditItemId(null);
  };

  const handleViewList = (id: number) => {
    router.push(`/groceries/grocery-items?id=${id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateItem = async () => {
    if (editItemId !== null) {
      // Update existing item
      const updatedLists = groceryLists.map((list) =>
        list.grocery_id === editItemId
          ? {
              ...list,
              grocery_name: formData.grocery_name,
              target_date: formData.target_date,
            }
          : list
      );
      setGroceryLists(updatedLists);
    } else {
      // Add new item
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/groceries/add-grocery",
        formData
      );

      setGroceryLists([...groceryLists, response.data]);
    }
    setFormData(groceryListForm);
    closeModal();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Logic to handle filtered lists based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLists([]);
    } else {
      const filtered = groceryLists.filter((list) =>
        list.grocery_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLists(filtered);
    }
  }, [searchQuery, groceryLists]);

  // Reset filtered lists when search query is cleared
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLists([]);
    }
  }, [searchQuery]);

  // Determine which list to render based on search state
  const listsToRender =
    searchQuery.trim() === "" ? groceryLists : filteredLists;
  const currentItems = listsToRender.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listsToRender.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-row items-baseline w-full justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Grocery Lists</h1>
            <Breadcrumbs
              crumbs={[{ title: "Grocery Lists", href: "/groceries" }]}
            />
          </div>
          <div className="mr-72">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div>
          <button
            onClick={openModal}
            className="mt-4 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded mb-4"
          >
            Add New List
          </button>
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Date Needed</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((list) => (
              <tr key={list.grocery_id}>
                <td className="border-t border-dashed p-6">
                  {list.grocery_name}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  {list.target_date}
                </td>
                <td
                  className={`${
                    list.status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-700"
                  } border-b border-dashed`}
                >
                  {list.status}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  <a
                    onClick={() => handleViewList(list.grocery_id)}
                    className="text-red-900 rounded  hover:font-semibold cursor-pointer"
                  >
                    View List
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <Modal isOpen={isModalVisible} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-red-900">
            {editItemId !== null ? "Edit List" : "Add New List"}
          </h2>
          <div className="flex flex-col space-y-4 p-2">
            <input
              type="text"
              name="grocery_name"
              value={formData.grocery_name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
            />
            <label htmlFor="#" className="text-sm font-medium pl-2">
              Date Needed
            </label>
            <input
              type="date"
              name="target_date"
              value={formData.target_date}
              onChange={handleInputChange}
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <button
              onClick={handleAddOrUpdateItem}
              className="bg-red-900 text-white p-2 rounded hover:bg-red-800"
            >
              {editItemId !== null ? "Update List" : "Create List"}
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default GroceryLists;
