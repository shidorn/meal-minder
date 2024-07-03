"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUserFriends,
  FaShoppingCart,
  FaRegListAlt,
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Members", path: "/members", icon: <FaUserFriends /> },
    { name: "Groceries", path: "/groceries", icon: <FaShoppingCart /> },
    { name: "Inventory", path: "/inventory", icon: <MdOutlineInventory /> },
    { name: "Recipes", path: "/recipes", icon: <FaRegListAlt /> },
  ];

  return (
    <div className="fixed bg-red-900 h-full overflow-hidden w-64 text-white flex flex-col items-center p-4 gap-4">
      <div className="logo mb-10">
        <Image
          src={`/images/logo.png`}
          alt="logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>

      <nav className="flex-1 p-4 pl-20">
        <ul className="space-y-4 ">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={pathname === item.path ? "active" : ""}
            >
              <Link href={item.path}>
                <p
                  className={`hover:font-bold p-2 w-64 h-16 flex flex-row gap-6 ${
                    pathname === item.path ? "text-xl font-bold" : ""
                  }`}
                >
                  {item.icon}
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .active {
          font-weight: lighter;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
