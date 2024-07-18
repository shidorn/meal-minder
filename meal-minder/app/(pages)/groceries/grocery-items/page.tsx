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
  item_measurement: string;
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
    item_measurement: "",
    item_category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const user = localStorage.getItem("username")?.toString();
  const currentUser = { name: user };
  const listId = searchParams.get("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<GroceryItem[]>([]);
  const [listStatus, setListStatus] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        checkTokenExpiration().catch(console.error);
        setupTokenExpirationCheck();

        const token = getAccessToken();
        if (!token) {
          logout();
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/item-list/${listId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData: GroceryItem[] = response.data;

        const purchasedItems = responseData.filter((item) => item.is_purchase);
        const unPurchasedItems = responseData.filter(
          (item) => !item.is_purchase
        );

        const updatedItems = [...unPurchasedItems, ...purchasedItems];

        setGroceryItems(updatedItems);
        setFilteredItems(updatedItems);

        const statusResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/grocery-list-status/${listId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListStatus(statusResponse.data[0].f0);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router, listId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(groceryItems);
    } else {
      const filtered = groceryItems.filter(
        (list) =>
          list.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          list.item_category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, groceryItems]);

  const openModal = () => {
    if (listStatus !== "DONE") {
      setIsModalOpen(true);
    } else {
      alert("You cannot add items to a list that is already marked as 'DONE'.");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      item_name: "",
      item_quantity: 1,
      item_measurement: "",
      item_category: "",
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
      !formData.item_measurement ||
      !formData.item_category
    ) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      logout();
      return;
    }

    if (editItemId === null) {
      const newItem = {
        ...formData,
        grocery_id: parseInt(listId ?? ""),
        user_id: parseInt(localStorage.getItem("user_id") ?? ""),
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/add-item`,
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGroceryItems([response.data, ...groceryItems]);
      setFilteredItems([response.data, ...filteredItems]);
    } else {
      const updateFormData = {
        item_name: formData.item_name,
        item_quantity: parseInt(formData.item_quantity.toString()),
        item_category: formData.item_category,
        item_measurement: formData.item_measurement,
        grocery_id: parseInt(listId ?? ""),
        user_id: parseInt(localStorage.getItem("user_id") ?? ""),
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/update-item/${editItemId}`,
        updateFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedItems = groceryItems.map((item) =>
        item.item_id === editItemId ? { ...item, ...updateFormData } : item
      );
      setGroceryItems(updatedItems);

      const updatedFilteredItems = filteredItems.map((item) =>
        item.item_id === editItemId ? { ...item, ...updateFormData } : item
      );
      setFilteredItems(updatedFilteredItems);
    }

    closeModal();
  };

  const handleEditItem = (id: number) => {
    const selectedItem = groceryItems.find((item) => item.item_id === id);
    if (selectedItem) {
      setFormData(selectedItem);
      setEditItemId(id);
      openModal();
    }
  };

  const handleDeleteItem = async (id: number) => {
    const token = getAccessToken();
    if (!token) {
      logout();
      return;
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/delete-item`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGroceryItems(groceryItems.filter((item) => item.item_id !== id));
    setFilteredItems(filteredItems.filter((item) => item.item_id !== id));
  };

  const handleCheckboxChange = async (id: number, status: boolean) => {
    const token = getAccessToken();
    if (!token) {
      logout();
      return;
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/groceries/update-item-status/${id}`,
      { is_purchase: !status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGroceryItems(
      groceryItems.map((item) =>
        item.item_id === id ? { ...item, is_purchase: !item.is_purchase } : item
      )
    );

    setFilteredItems(
      filteredItems.map((item) =>
        item.item_id === id ? { ...item, is_purchase: !item.is_purchase } : item
      )
    );
  };

  const isFormValid = () =>
    formData.item_name &&
    formData.item_quantity > 0 &&
    formData.item_measurement &&
    formData.item_category;

  const listsToRender = searchTerm.trim() === "" ? groceryItems : filteredItems;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listsToRender.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listsToRender.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
              <th className="py-2 px-4 text-left">Measurement Unit</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Added By</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item.item_id}
                className={`border-t border-dashed ${
                  item.is_purchase ? "opacity-50" : ""
                }`}
              >
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={item.is_purchase}
                    onChange={() =>
                      handleCheckboxChange(item.item_id, item.is_purchase)
                    }
                    className="form-checkbox h-4 w-4"
                    disabled={item.is_purchase}
                  />
                </td>
                <td className="py-2 px-4">{item.item_name}</td>
                <td className="py-2 px-4">{item.item_quantity}</td>
                <td className="py-2 px-4">{item.item_measurement}</td>
                <td className="py-2 px-4">{item.item_category}</td>
                <td className="py-2 px-4">
                  {item.user && item.user.username
                    ? item.user.username
                    : currentUser
                    ? currentUser.name
                    : "User Not Available"}
                </td>
                <td className="py-2 px-4 flex gap-4">
                  {!item.is_purchase && (
                    <>
                      <FaEdit
                        onClick={() => handleEditItem(item.item_id)}
                        className="text-yellow-500 cursor-pointer"
                      />
                      <FaTrash
                        onClick={() => handleDeleteItem(item.item_id)}
                        className="text-red-500 cursor-pointer"
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="absolute bottom-10 left-1/2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
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
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md"
              id="item_measurement"
              type="text"
              name="item_measurement"
              placeholder="unit (eg., kg, mg, ml)"
              value={formData.item_measurement}
              onChange={handleInputChange}
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
