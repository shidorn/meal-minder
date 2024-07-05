"use client";
import Layout from "@/app/components/Layout";
import React, { useState } from "react";
import Image from "next/image";
import { FaUserFriends } from "react-icons/fa";
import Button from "@/app/components/buttons/button";
import Modal from "@/app/components/modal/Modal";

interface FamilyMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string; // Add image property
}

const MembersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    first_name: "",
    last_name: "",
    email: "",
    image: "/images/default-profile.jpg", // Default profile image
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file

  const members: FamilyMember[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Dela Cruz",
      email: "johndelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Dela Cruz",
      email: "janedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 3,
      first_name: "Janine",
      last_name: "Dela Cruz",
      email: "janinedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 4,
      first_name: "Janella",
      last_name: "Dela Cruz",
      email: "janelladelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewMember({
      first_name: "",
      last_name: "",
      email: "",
      image: "/images/default-profile.jpg",
    });
    setSelectedFile(null); // Clear selected file state
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddMember = () => {
    // Normally you would handle API calls or state updates here to add the member
    console.log("Adding member:", newMember);
    console.log("Selected file:", selectedFile); // Handle the selected file as needed
    closeModal();
  };

  return (
    <Layout>
      <div className="p-2 h-full">
        <h1 className="text-2xl font-bold">Your Members</h1>
        <div className="p-6">
          <p className="text-xl font-medium flex items-center gap-2">
            {" "}
            Dela Cruz Family
            <span>
              <FaUserFriends />
            </span>
          </p>
        </div>
        <div className="grid grid-flow-col gap-6 p-6">
          {members.map((mem) => (
            <div
              key={mem.id}
              className="flex items-center p-4 gap-4 bg-white rounded-lg"
            >
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={mem.image}
                  alt={`${mem.first_name} ${mem.last_name}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <span className="flex flex-col">
                {mem.first_name} {mem.last_name}
                <span className="text-sm text-gray-400">{mem.email}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button title="Add Member" onClick={handleOpenModal} />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add Member</h1>
            <div className="space-y-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={newMember.first_name}
                onChange={handleChange}
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={newMember.last_name}
                onChange={handleChange}
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newMember.email}
                onChange={handleChange}
                className="p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
              <div>
                <label htmlFor="profile" className="pl-2 mt-2 text-gray-400">
                  Profile picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button title="Add" onClick={handleAddMember} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default MembersPage;
