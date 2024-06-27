"use client";
import React, { useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaPerson } from "react-icons/fa6";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Header: React.FC = () => {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="text-black bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className=""></h1>
      {user && (
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={user.profileImage}
              alt={`${user.name}'s profile`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="pr-2">{user.name}</span>
            <RiArrowDropDownLine />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <a
                href="#"
                className="px-4 py-2 text-gray-800 hover:text-red-900 flex items-center gap-4 hover:bg-gray-50"
                onClick={closeDropdown}
              >
                <FaUser />
                Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-2 text-gray-800 hover:text-red-900 hover:bg-gray-50"
                onClick={closeDropdown}
              >
                <FaSignOutAlt />
                Logout
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
