"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { GroceryItem } from "@/app/types/type";
import { useGroceryContext } from "@/context/GroceryContext";
import { FaStar, FaTimesCircle, FaTrash } from "react-icons/fa";
import { RiTimer2Line } from "react-icons/ri";
import { GoShare } from "react-icons/go";
import { FaShare } from "react-icons/fa6";
import { PiCookingPotLight } from "react-icons/pi";

interface RecipeProps {
  id: string;
  name: string;
  image: string;
  ingredients: { name: string; quantity: number }[];
  cookingTime: string;
}

const recipes: RecipeProps[] = [
  {
    id: "1",
    name: "Pancakes",
    image: "",
    ingredients: [
      { name: "Flour", quantity: 2 },
      { name: "Eggs", quantity: 2 },
      { name: "Milk", quantity: 1 },
    ],
    cookingTime: "20mins",
  },
  {
    id: "2",
    name: "Omelette",
    image: "",
    ingredients: [
      { name: "Eggs", quantity: 3 },
      { name: "Cheese", quantity: 1 },
      { name: "Ham", quantity: 1 },
    ],
    cookingTime: "20mins",
  },
  // Add more recipes as needed
];
const Recipes: React.FC<RecipeProps> = () => {
  const router = useRouter();
  const { groceryItems } = useGroceryContext();
  const [loading, setLoading] = useState(true);
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
  // if (loading) {
  //   return (
  //     <div className="absolute top-2/4 left-2/4">
  //       <div className="flex flex-col gap-6 justify-center items-center space-x-2">
  //         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
  //         <span className="text-lg font-bold">Loading</span>
  //       </div>
  //     </div>
  //   );
  // }
  const availableRecipes = recipes.filter((recipe) => {
    return recipe.ingredients.every((ingredient) => {
      const item = groceryItems.find(
        (groceryItem: GroceryItem) =>
          groceryItem.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      return item && item.quantity >= ingredient.quantity;
    });
  });

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Available Recipes</h1>
        {availableRecipes.length === 0 ? (
          <p>No recipes can be made with the current inventory.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="card mb-4 p-4 border rounded shadow"
              >
                <Image
                  src={recipe.image}
                  alt="image"
                  width={500}
                  height={100}
                  className="w-fit rounded-t-md"
                />
                <h2 className="text-md font-medium">{recipe.name}</h2>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <RiTimer2Line /> <p>{recipe.cookingTime}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <PiCookingPotLight />
                    <p>{`${recipe.ingredients.length} ingredients`}</p>
                  </div>
                </div>

                <hr />
                <div className="flex items-center justify-between p-4">
                  <FaShare />
                  <FaStar />
                  <FaTrash />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* <div className="grid grid-rows-3 md:grid-rows-2 sm:grid-rows-1 p-2 bg-white w-64 rounded-md shadow-md hover:bg-slate-50">
          <Image
            src={"/images/pancake.jpg"}
            alt="image"
            width={500}
            height={100}
            className="w-fit rounded-t-md"
          />
          <h2 className="text-md font-medium">Pancake</h2>
          <div className="flex justify-between">
            <div className="flex items-center gap-2 mb-4">
              <RiTimer2Line /> <p>20mins</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <PiCookingPotLight />
              <p>8 ingredients</p>
            </div>
          </div>

          <hr />
          <div className="flex items-center justify-between p-4">
            <FaShare />
            <FaStar />
            <FaTrash />
          </div>
        </div> */}
      </div>
    </Layout>
  );
};

export default Recipes;
