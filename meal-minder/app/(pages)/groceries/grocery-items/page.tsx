"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/app/components/modal/Modal";
import Layout from "@/app/components/Layout";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
}

const initialFormData = {
  name: "",
  quantity: 0,
  category: "",
  addedBy: "",
};

const initialGroceryItems: GroceryItem[] = [
  { id: 1, name: "Apples", quantity: 4, category: "Fruit", addedBy: "John" },
  { id: 2, name: "Bread", quantity: 2, category: "Bakery", addedBy: "Jane" },
  // Add more initial grocery items here if needed
];

const GroceryItemsPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
  }, [router]);

  const [groceryItems, setGroceryItems] =
    useState<GroceryItem[]>(initialGroceryItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditItemId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateItem = () => {
    if (editItemId !== null) {
      // Update existing item
      const updatedItems = groceryItems.map((item) =>
        item.id === editItemId ? { ...item, ...formData } : item
      );
      setGroceryItems(updatedItems);
    } else {
      // Add new item
      const newItem: GroceryItem = {
        id: groceryItems.length + 1,
        ...formData,
      };
      setGroceryItems([...groceryItems, newItem]);
    }
    closeModal();
  };

  const handleEditItem = (id: number) => {
    const selectedItem = groceryItems.find((item) => item.id === id);
    if (selectedItem) {
      setFormData(selectedItem);
      setEditItemId(id);
      setIsModalOpen(true);
    }
  };

  const handleDeleteItem = (id: number) => {
    const updatedItems = groceryItems.filter((item) => item.id !== id);
    setGroceryItems(updatedItems);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Grocery Items</h1>
          <Breadcrumbs
            crumbs={[
              { title: "Grocery Lists", href: "/groceries" },
              { title: "Grocery Items", href: "/groceries/grocery-items" },
            ]}
          />
        </div>

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Added By</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceryItems.map((item) => (
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
                  {item.addedBy}
                </td>
                <td className="border-t border-dashed py-2 px-4 flex gap-20">
                  <FaEdit
                    onClick={() => handleEditItem(item.id)}
                    className="text-yellow-500"
                  />
                  <FaTrash
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-blue-950"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={openModal}
          className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded mb-4"
        >
          Add New Item
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-red-900">
            {editItemId !== null ? "Edit Item" : "Add New Item"}
          </h2>
          <div className="flex flex-col space-y-4 p-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <input
              type="text"
              name="addedBy"
              value={formData.addedBy}
              onChange={handleInputChange}
              placeholder="Added By"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
            />
            <button
              onClick={handleAddOrUpdateItem}
              className="bg-red-900 text-white p-2 rounded hover:bg-red-800"
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
