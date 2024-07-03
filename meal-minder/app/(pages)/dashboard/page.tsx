"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";
import { FaStar, FaUserFriends } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";

const Dashboard = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  // useEffect(() => {
  //   checkTokenExpiration().catch(console.error);
  //   setupTokenExpirationCheck();
  //   const fetchData = async () => {
  //     try {
  //       const token = getAccessToken();
  //       if (!token) {
  //         logout(); // Redirect to login if no token is available
  //         return;
  //       }
  //       const response = await axios.get(
  //         process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch data", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
