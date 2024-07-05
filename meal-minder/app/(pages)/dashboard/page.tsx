"use client";
import Layout from "@/app/components/Layout";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaUserFriends, FaHeart } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { Recipe, FamilyMember } from "@/app/types/type";
import Image from "next/image";
import Inventory from "@/app/components/inventory/Inventory";
import { Fa42Group, FaTeamspeak } from "react-icons/fa6";

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

  const favoriteRecipes: Recipe[] = [
    { id: 1, name: "Spaghetti Carbonara", image: "/images/spaghetti.jpg" },
    { id: 2, name: "Chocolate Chip Cookies", image: "/images/cookies.jpg" },
    { id: 3, name: "Grilled Salmon", image: "/images/salmon.jpg" },
  ];

  const members: FamilyMember[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Dela Cruz",
      email: "johndelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Dela Cruz",
      email: "janedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 3,
      first_name: "Janine",
      last_name: "Dela Cruz",
      email: "janinedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 4,
      first_name: "Janella",
      last_name: "Dela Cruz",
      email: "janelladelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
  ];

  return (
    <Layout>
      <div>
        <h1>Welcome to Protected Dashboard</h1>
      </div>
    </Layout>
  );
};

export default Dashboard;
