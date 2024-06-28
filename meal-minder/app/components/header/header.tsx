"use client";
import React, { useState } from "react";
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
        </div>
      </div>
    </header>
  );
};

export default Header;
