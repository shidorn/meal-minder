import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/app/auth";
import { GoPersonFill, GoSignOut } from "react-icons/go";
import Modal from "../modal/Modal";

const Header: React.FC = () => {
  const router = useRouter();
  const [ProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true); // Open the modal
  };

  const closeModal = () => {
    setOpenModal(false); // Close the modal
  };

  const handleProfileSectionClick = () => {
    setProfileDropdownOpen(!ProfileDropdownOpen);
  };

  const handleNotifClicked = () => {
    setNotifDropdown(!notifDropdown);
  };

  const handleProfileClicked = () => {
    router.push("/profile");
  };

  return (
    <header className="sticky top-0 w-full h-16 bg-white text-black flex items-center justify-end px-4 shadow-md z-10">
      <div className="flex items-center gap-4">
        {localStorage.getItem("username")?.toString() && (
          <div className="relative">
            <button
              className="flex flex-row gap-2 items-center hover:text-red-900"
              onClick={handleNotifClicked}
            >
              <FaBell />
              <p>Notifications</p>
            </button>
            {notifDropdown && (
              <div className="absolute right-0 mt-2 w-96 h-96 border bg-white rounded-lg shadow-lg px-4 py-2 text-sm">
                <p className="italic text-gray-500">Nothing for now.</p>
              </div>
            )}
          </div>
        )}
        {localStorage.getItem("username")?.toString() && (
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleProfileSectionClick}
            >
              <Image
                src={
                  localStorage.getItem("photo_path")?.toString() ||
                  "/images/default-profile.jpg"
                }
                alt="User Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="hidden md:block">
                {localStorage.getItem("username")?.toString()}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  ProfileDropdownOpen ? "rotate-180" : ""
                } text-gray-400 transition-transform duration-300`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-.707.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* Profile dropdown */}
            {ProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                <a
                  href="#"
                  className="flex items-center gap-4 font-medium px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={handleProfileClicked}
                >
                  <GoPersonFill />
                  Profile
                </a>
                <hr className="my-1" />
                <a
                  href="#"
                  className="flex items-center gap-4 px-4 py-2 text-gray-800 hover:text-red-900 hover:bg-gray-50"
                  onClick={handleOpenModal}
                >
                  <GoSignOut />
                  Logout
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={openModal} onClose={closeModal}>
        <div className="flex flex-col gap-6 items-center">
          <p>Are you sure you want to logout?</p>
          <div className="flex space-x-2 mt-4 items-center justify-center gap-6">
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-red-800"
            >
              No
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="p-2 w-20 text-white bg-red-800 hover:bg-red-900 rounded-lg"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
