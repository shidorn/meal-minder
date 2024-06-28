"use client";

import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoPersonFill, GoSignOut } from "react-icons/go";

const Header = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [user, setUser] = useState({
    name: "",
    profilePicture: "/images/default-profile.jpg",
  });
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/users");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
  const handleProfileClick = () => {
    setIsDropDownVisible(!isDropDownVisible);
  };

  return (
    <header className="w-full h-16 bg-white text-black flex items-center justify-end px-4 shadow-md">
      <div className="flex items-center space-x-4">
        <button className="flex flex-row gap-2 items-center hover:text-red-900">
          <FaBell />
          <p>Notifications</p>
        </button>
        {/* Dropdown Menu */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <Image
              src={user.profilePicture}
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full w-fit"
            />
            <span className="hidden md:block">{user.name}</span>
            {/* Arrow for dropdown */}
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
              >
                <GoPersonFill />
                Profile
              </a>
              <hr className="my-1" />
              <a
                href="#"
                className="flex items-center gap-4 font-medium px-4 py-2 text-red-900 hover:bg-gray-100"
                onClick={handleLogoutClick}
                download={<ClipLoader size={24} />}
              >
                <GoSignOut />
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
