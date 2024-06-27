"use client";
import React, { useState } from "react";
import Modal from "@/app/components/modal/Modal";
import Layout from "@/app/components/Layout";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/search-bar/SearchBar";

interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  isPurchased: boolean;
}

const initialFormData = {
  name: "",
  quantity: 0,
  category: "",
  addedBy: "",
};

const initialGroceryItems: GroceryItem[] = [
  {
    id: 1,
    name: "Apples",
    quantity: 4,
    category: "Fruit",
    addedBy: "John",
    isPurchased: false,
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

const GroceryItemsPage = () => {
  const [groceryItems, setGroceryItems] =
    useState<GroceryItem[]>(initialGroceryItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const router = useRouter();
  const currentUser = { name: "Christine" };

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
    if (!formData.name || formData.quantity <= 0 || !formData.category) {
      alert("Please fill out all fields with valid values.");
      return;
    }
    if (editItemId !== null) {
      const updatedItems = groceryItems.map((item) =>
        item.id === editItemId
          ? { ...item, ...formData, addedBy: currentUser.name }
          : item
      );
      setGroceryItems(updatedItems);
    } else {
      const newItem: GroceryItem = {
        id: groceryItems.length + 1,
        ...formData,
        addedBy: currentUser.name,
        isPurchased: false,
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

  const handleCheckboxChange = (id: number) => {
    const updatedItems = groceryItems.map((item) =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    setGroceryItems(updatedItems);
  };

  const isFormValid = () => {
    return formData.name && formData.quantity > 0 && formData.category;
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-row justify-between">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Grocery Items</h1>
            <Breadcrumbs
              crumbs={[
                { title: "Grocery Lists", href: "/groceries" },
                { title: "Grocery Items", href: "/groceries/grocery-items" },
              ]}
            />
          </div>
          <div className="mr-72">
            <SearchBar onSearch={() => {}} />
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
            {groceryItems.map((item) => (
              <tr key={item.id}>
                <td className="border-t border-dashed py-2 px-4">
                  <input
                    type="checkbox"
                    checked={item.isPurchased}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
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
                <td className="border-t border-dashed py-2 px-4 flex gap-4">
                  <FaEdit
                    onClick={() => handleEditItem(item.id)}
                    className="text-yellow-500 cursor-pointer"
                  />
                  <FaTrash
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 cursor-pointer"
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
        <button
          onClick={() => router.push("/groceries/inventory")}
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
