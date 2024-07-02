"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Fa42Group, FaTeamspeak } from "react-icons/fa6";
import { FaHeart, FaStar, FaUserFriends } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
  }, [router]);

  return (
    <Layout>
      <div className="container  w-full h-full p-2">
        <div className="grid grid-cols-2 gap-6 items-center p-2 w-full h-2/4">
          <div className="flex gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
            <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
              <FaUserFriends className="w-6 text-red-800" />
            </div>
            <div>
              <h1 className="font-bold">Members</h1>
              <p className="text-sm text-gray-400">no. of participants</p>
            </div>
          </div>
          <div className="flex gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
            <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
              <FaStar className="w-6 text-red-800" />
            </div>
            <div className="pt-3 font-bold">
              <h1>Favorite Recipes</h1>
            </div>
          </div>
        </div>
        <div className=" h-2/4 p-2">
          <div className="flex gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
            <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
              <MdOutlineInventory className="w-6 text-red-800" />
            </div>
            <div className="pt-3">
              <h1 className="font-bold">Inventory</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
