"use client";
import React, { useState } from "react";
<<<<<<< HEAD
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogoutClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // const response = await axios.post(
    //   process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/logout"
    // );
    // console.log(response);
    // if (response.status == 200) {
    localStorage.removeItem("token");
    router.push("/login");
    // }
  };

  return (
    <header className="w-full h-16 bg-white text-black flex items-center justify-end px-4 shadow-md">
      <div className="flex items-center space-x-4">
        <Button
          title="Logout"
          onClick={handleLogoutClick}
          disabled={loading}
          loader={<ClipLoader size={24} />}
        />
        <button className="flex flex-row gap-2 items-center hover:text-red-900">
          <FaBell />
          <p>Notifications</p>
        </button>
        <div className="flex items-center space-x-2">
          <Image
            src="/images/unnamed.jpg"
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full w-fit"
          />
          <span className="hidden md:block">User Name</span>
=======
import { useUser } from "@/context/UserProvider";
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
>>>>>>> 03d1ad34241ee2cd70894a228369d0588ac4c071
        </div>
      )}
    </header>
  );
};

export default Header;
