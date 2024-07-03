"use client";
import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserProvider";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaPerson } from "react-icons/fa6";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { logout } from "@/app/auth";
import { GoPersonFill, GoSignOut } from "react-icons/go";

const Header: React.FC = () => {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  localStorage.setItem("user_id", user?.user_id ?? "");
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  // const [user, setUser] = useState({
  //   name: "",
  //   profilePicture: "/images/default-profile.jpg",
  // });

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get("/auth/getUser");
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         process.env.NEXT_PUBLIC_API_ENDPOINT + "auth/users"
  //       );
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleProfileClick = () => {
    setIsDropDownVisible(!isDropDownVisible);
  };

  const handleProfileClicked = () => {
    router.push("/profile");
  };

  if (loading) return <div>Loading...</div>; // Optionally show a loading indicator

  return (
    <header className="sticky top-0 w-full h-16 bg-white text-black flex items-center justify-end px-4 shadow-md z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-4">
          <button className="flex flex-row gap-2 items-center hover:text-red-900 ">
            <FaBell />
            <p>Notifications</p>
          </button>
        </div>
        {user && (
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleProfileClick}
            >
              <Image
                src={user.profileImage}
                alt="User Profile"
                width={32}
                height={32}
                className="rounded-full w-fit"
              />
              <span className="hidden md:block">{user.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  isDropDownVisible ? "rotate-180" : ""
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
            {/* Dropdown content */}
            {isDropDownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
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
                  onClick={logout}
                >
                  <GoSignOut />
                  Logout
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
