"use client";
import SearchBar from "@/app/components/search-bar/SearchBar";
import React, { useState } from "react";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/app/components/BreadCrumbs";
import Modal from "@/app/components/modal/Modal";

interface GroceryList {
  id: number;
  name: string;
  dateCreated: string;
  targetDate: string;
  status: string;
}

const initialFormData = {
  name: "",
  targetDate: "",
};

const initialGroceryLists: GroceryList[] = [
  {
    id: 1,
    name: "Weekly Shopping",
    dateCreated: "2024-06-20",
    targetDate: "2024-06-27",
    status: "Pending",
  },
  // Add more initial grocery lists here if needed
];

const GroceryLists = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [groceryLists, setGroceryLists] =
    useState<GroceryList[]>(initialGroceryLists);
  const router = useRouter();

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setFormData(initialFormData);
    setEditItemId(null);
  };

  const handleViewList = (id: number) => {
    router.push(`/groceries/grocery-items?id=${id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateItem = () => {
    if (editItemId !== null) {
      // Update existing item
      const updatedLists = groceryLists.map((list) =>
        list.id === editItemId
          ? { ...list, name: formData.name, targetDate: formData.targetDate }
          : list
      );
      setGroceryLists(updatedLists);
    } else {
      // Add new item
      const newList: GroceryList = {
        id: groceryLists.length + 1,
        name: formData.name,
        dateCreated: new Date().toISOString().slice(0, 10),
        targetDate: formData.targetDate,
        status: "Pending",
      };
      setGroceryLists([...groceryLists, newList]);
    }
    setFormData(initialFormData);
    closeModal();
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
            <SearchBar onSearch={() => {}} />
          </div>
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Date Created</th>
              <th className="py-2 px-4 text-left">Target Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {groceryLists.map((list) => (
              <tr key={list.id}>
                <td className="border-t border-dashed py-2 px-4">
                  {list.name}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  {list.dateCreated}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  {list.targetDate}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  {list.status}
                </td>
                <td className="border-t border-dashed py-2 px-4">
                  <button
                    onClick={() => handleViewList(list.id)}
                    className="px-4 py-2 text-red-900 rounded hover:bg-red-900 hover:text-white"
                  >
                    View List
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={openModal}
          className="mt-4 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded"
        >
          Add New List
        </button>

        <Modal isOpen={isModalVisible} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-red-900">
            {editItemId !== null ? "Edit List" : "Add New List"}
          </h2>
          <div className="flex flex-col space-y-4 p-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
            />
            <label htmlFor="#" className="text-sm font-medium pl-2">
              Date Needed
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
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
