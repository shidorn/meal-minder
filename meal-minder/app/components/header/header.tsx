import React from "react";
import { FaBell } from "react-icons/fa";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-16 bg-white text-black flex items-center justify-end px-4 shadow-md">
      <div className="flex items-center space-x-4">
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
