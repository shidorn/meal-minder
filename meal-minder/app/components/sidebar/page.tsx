"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaUserFriends,
  FaShoppingCart,
  FaRegListAlt,
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="bg-red-900 h-screen w-64 text-white flex flex-col items-center p-4 gap-4">
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
          <li className="">
            <Link href="/dashboard">
              <p className="hover:font-bold p-2 w-64 h-16 flex flex-row gap-6">
                <FaHome />
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link href="/members">
              <p className="hover:font-bold p-2 w-64 h-16 flex flex-row gap-6">
                <FaUserFriends />
                Members
              </p>
            </Link>
          </li>
          <li>
            <Link href="/groceries">
              <p className="hover:font-bold p-2 w-64 h-16 flex flex-row gap-6">
                <FaShoppingCart /> Groceries
              </p>
            </Link>
          </li>
          <li>
            <Link href="/inventory">
              <p className="hover:font-bold p-2 w-64 h-16 flex flex-row gap-6">
                <MdOutlineInventory /> Inventory
              </p>
            </Link>
          </li>
          <li>
            <Link href="/recipes">
              <p className="hover:font-bold p-2 w-64 h-16 flex flex-row gap-6">
                <FaRegListAlt /> Recipes
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
