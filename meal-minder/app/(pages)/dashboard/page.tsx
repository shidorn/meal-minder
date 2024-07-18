"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaUserFriends, FaHeart } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import { Recipe, FamilyMember } from "@/app/types/type";
import Image from "next/image";
import Inventory from "@/app/components/inventory/Inventory";
import { Fa42Group, FaTeamspeak } from "react-icons/fa6";
import {
  checkTokenExpiration,
  getAccessToken,
  logout,
  setupTokenExpirationCheck,
} from "@/app/auth";
import axios from "axios";

const Dashboard = () => {
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe>({
    recipe_id: 0,
    recipe_name: "",
    description: "",
    instruction: "",
    photo_path: "",
    cooking_time: "",
    is_favorite: false,
  });

  useEffect(() => {
    checkTokenExpiration().catch(console.error);
    setupTokenExpirationCheck();
    const token = getAccessToken();
    if (!token) {
      logout(); // Redirect to login if no token is available
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/recipes/get-favorites",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const responseData: Recipe[] = response.data;
        const updatedFavoriteRecipes = [...favoriteRecipes];
        const uniqueRecipe = new Set(
          favoriteRecipes.map((data) => data.recipe_id)
        );
        responseData.forEach((data) => {
          if (!uniqueRecipe.has(data.recipe_id)) {
            updatedFavoriteRecipes.push(data);
          }
        });
        setFavoriteRecipes(updatedFavoriteRecipes);
        console.log(responseData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
      <div className="container w-full h-full p-2">
        <div className="flex flex-col h-full ml-8">
          <div className="grid grid-cols-2 gap-6 items-center p-2 w-full h-2/4">
            <div className="flex flex-col gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
              <div className="flex gap-4 ">
                <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
                  <FaUserFriends className="w-6 text-red-800" />
                </div>
                <div>
                  <h1 className="font-bold">Members</h1>
                  <p className="text-sm text-gray-400">
                    {members.length} participants
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                {members.map((mem) => (
                  <div key={mem.id} className="flex items-center p-4 gap-4">
                    <Image
                      src={mem.image}
                      alt="profile"
                      width={40}
                      height={40}
                      className="rounded-full shadow-lg"
                    />
                    <span className="flex flex-col">
                      {mem.first_name} {mem.last_name}
                      <span className="text-sm text-gray-400">{mem.email}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
              <div className="flex gap-4">
                <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
                  <FaStar className="w-6 text-red-800" />
                </div>
                <div className="pt-3 font-bold">
                  <h1>Favorite Recipes</h1>
                </div>
              </div>
              <div className="grid grid-cols-2 self-center">
                {favoriteRecipes.length === 0 ? (
                  <p>No Favorite Recipes Yet.</p>
                ) : (
                  favoriteRecipes.map((recipe) => (
                    <div
                      key={recipe.recipe_id}
                      className=" flex items-center p-4 gap-4"
                    >
                      <Image
                        src="/images/arcticons_recipe-keeper.png"
                        alt="favorites"
                        width={40}
                        height={40}
                      />
                      <p className="text-md">{recipe.recipe_name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className=" h-2/4 p-2">
            <div className="flex flex-col gap-4 bg-white p-4 h-full rounded-lg shadow-lg">
              <div className="flex gap-4">
                <div className="bg-red-300 w-10 h-10 px-2 py-3 rounded-full">
                  <MdOutlineInventory className="w-6 text-red-800" />
                </div>
                <div className="pt-3">
                  <h1 className="font-bold">Inventory</h1>
                </div>
              </div>
              <div>
                <Inventory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
