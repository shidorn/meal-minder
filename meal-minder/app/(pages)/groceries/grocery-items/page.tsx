"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/app/components/modal/Modal";
import Layout from "@/app/components/Layout";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/app/components/search-bar/SearchBar";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";
import Pagination from "@/app/components/pagination/Pagination";

interface GroceryItem {
  item_id: number;
  item_name: string;
  item_quantity: number;
  item_category: string;
  user: { username: string };
  is_purchase: boolean;
}

const GroceryItemsPage = () => {
  const router = useRouter();
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    item_quantity: 1,
    item_category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const user = localStorage.getItem("user_name")?.toString();
  const currentUser = { name: user };
  const listId = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    setFilteredItems(
      groceryItems.filter(
        (item) =>
          item.is_purchase &&
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    checkTokenExpiration().catch(console.error);
    setupTokenExpirationCheck();

    const fetchData = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          logout(); // Redirect to login if no token is available
          return;
        }
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            "/groceries/item-list/" +
            listId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData: GroceryItem[] = response.data;
        responseData.forEach((item) => {
          groceryItems.push(item);
        });
        setGroceryItems((groceryItems) => [...groceryItems]);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router, groceryItems, searchTerm]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      item_name: "",
      item_quantity: 1,
      item_category: "",
      // user_id: "",
    });
    setEditItemId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateItem = async () => {
    if (
      !formData.item_name ||
      formData.item_quantity <= 0 ||
      !formData.item_category
    ) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    if (editItemId === null) {
      console.log("formData :", formData);
      const newItem = {
        ...formData,
        grocery_id: parseInt(listId ?? ""),
        user_id: parseInt(localStorage.getItem("user_id") ?? ""),
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/groceries/add-item",
        newItem
      );
      console.log(response.data);
      setGroceryItems([...groceryItems, response.data]);
    } else {
      const updateFormData = {
        item_name: formData.item_name,
        item_quantity: parseInt(formData.item_quantity.toString()),
        item_category: formData.item_category,
        grocery_id: parseInt(listId ?? ""),
        user_id: parseInt(localStorage.getItem("user_id") ?? ""),
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT +
          "/groceries/update-item/" +
          editItemId,
        updateFormData
      );
      console.log(response.data);
      const updatedItems = groceryItems.map((item) =>
        item.item_id === editItemId ? { ...item, ...updateFormData } : item
      );
      setGroceryItems(updatedItems);
    }

    closeModal();
  };

  const handleEditItem = (id: number) => {
    const selectedItem = groceryItems.find((item) => item.item_id === id);
    console.log(selectedItem);
    if (selectedItem) {
      setFormData(selectedItem);
      setEditItemId(id);
      openModal();
    }
  };

  const handleDeleteItem = async (id: number) => {
    console.log(id);
    const item_id = { id: id };
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/groceries/delete-item",
      item_id
    );
    console.log(response.data);
    setGroceryItems(groceryItems.filter((item) => item.item_id !== id));
  };

  const handleCheckboxChange = async (id: number, status: boolean) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT +
        "/groceries/update-item-status/" +
        id,
      { is_purchase: !status }
    );
    setGroceryItems(
      groceryItems.map((item) =>
        item.item_id === id ? { ...item, is_purchase: !item.is_purchase } : item
      )
    );
  };

  const isFormValid = () =>
    formData.item_name && formData.item_quantity > 0 && formData.item_category;
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groceryItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(groceryItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Grocery Items</h1>
            <Breadcrumbs
              crumbs={[
                { title: "Grocery Lists", href: "/groceries" },
                { title: "Grocery Items", href: "/groceries/grocery-items" },
              ]}
            />
          </div>
          <div className="mr-72">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left"></th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Added By</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.item_id} className="border-t border-dashed">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={item.is_purchase}
                    onChange={() =>
                      handleCheckboxChange(item.item_id, item.is_purchase)
                    }
                    className="form-checkbox h-4 w-4"
                  />
                </td>
                <td className="py-2 px-4">{item.item_name}</td>
                <td className="py-2 px-4">{item.item_quantity}</td>
                <td className="py-2 px-4">{item.item_category}</td>
                <td className="py-2 px-4">
                  {item.user && item.user.username
                    ? item.user.username
                    : currentUser
                    ? currentUser.name
                    : "User Not Available"}
                </td>
                <td className="py-2 px-4 flex gap-4">
                  <FaEdit
                    onClick={() => handleEditItem(item.item_id)}
                    className="text-yellow-500 cursor-pointer"
                  />
                  <FaTrash
                    onClick={() => handleDeleteItem(item.item_id)}
                    className="text-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <button
          onClick={openModal}
          className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded mb-4"
        >
          Add New Item
        </button>
        <button
          onClick={() => router.push("/inventory")}
          className="text-red-900 hover:font-bold px-4 py-2 rounded mb-4 ml-6"
        >
          View Inventory
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-red-900">
            {editItemId !== null ? "Edit Item" : "Add New Item"}
          </h2>
          <div className="flex flex-col space-y-4 p-6">
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="number"
              name="item_quantity"
              value={formData.item_quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="text"
              name="item_category"
              value={formData.item_category}
              onChange={handleInputChange}
              placeholder="Category"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="text"
              name="user_id"
              value={currentUser.name}
              readOnly
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <button
              onClick={handleAddOrUpdateItem}
              className="bg-red-900 text-white p-2 rounded hover:bg-red-800"
              disabled={!isFormValid()}
            >
              {editItemId !== null ? "Update Item" : "Add Item"}
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default GroceryItemsPage;
