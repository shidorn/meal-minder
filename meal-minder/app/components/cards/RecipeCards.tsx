import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegClock, FaShare, FaTrash } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import {
  checkTokenExpiration,
  getAccessToken,
  logout,
  setupTokenExpirationCheck,
} from "@/app/auth";
import axios from "axios";

interface RecipeCardProps {
  id: string;
  name: string;
  ingredients: { ingredient_name: string; ingredient_quantity: number }[];
  image: string;
  cookingTime: string;
  instruction: string;
  description: string;
  deleteRecipe: (id: string) => void;
  toggleFavorite: () => void;
  is_favorite: boolean;
}

interface GroceryItem {
  item_id: number;
  item_name: string;
  item_quantity: number;
  item_category: string;
  user: { username: string };
  is_purchased: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  name,
  ingredients,
  image,
  cookingTime,
  instruction,
  description,
  deleteRecipe,
  toggleFavorite,
  is_favorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleInstruction = () => {
    setShowInstruction(!showInstruction);
  };
  const [inventory, setInventory] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      checkTokenExpiration().catch(console.error);
      setupTokenExpirationCheck();
      const token = getAccessToken();
      // if (!token) {
      //   logout();
      //   return;
      // }

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            "/groceries/item-list-purchased",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        logout();
        return;
      }
    };
    fetchData();
  }, []);

  const unAvailableIngredient = ingredients.some((ingredient) => {
    return !inventory.some(
      (item) =>
        item.item_name.toLowerCase() ===
          ingredient.ingredient_name.toLowerCase() &&
        item.item_quantity >= ingredient.ingredient_quantity
    );
  });

  return (
    <div
      className={`card grid grid-rows-2 mb-4 border rounded-lg shadow ${
        unAvailableIngredient ? "border-red-500" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleInstruction}
    >
      <div className="relative h-64 overflow-hidden rounded-t-lg mb-2">
        <Image
          src={image}
          alt={`${name}`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        {isHovered && (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                className={`rounded-full p-2 text-white transition duration-300 ${
                  is_favorite ? "bg-yellow-500" : "bg-gray-700"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
              >
                <GoStar className="w-6 h-6" />
              </button>
            </div>
            {unAvailableIngredient && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center p-2">
                Some of the ingredients in this recipe are not available in your
                inventory
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <h2 className="text-md font-bold mb-2 text-center flex flex-col items-center">
          {name.toUpperCase()}
          <span className="text-xs font-medium text-gray-600">
            {description}
          </span>
        </h2>

        {showInstruction ? (
          <div className="max-h-60 overflow-y-auto">
            <p className="p-4 flex flex-col font-medium">
              Instructions: <span className="text-gray-500">{instruction}</span>
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-md mt-2 p-2">Ingredients:</h3>
            <ul className="list-disc list-inside px-6 flex flex-col flex-wrap">
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.ingredient_name} -{" "}
                  {ingredient.ingredient_quantity}
                </li>
              ))}
            </ul>
            <p className="flex items-center text-sm gap-2 mt-2 text-gray-400 mb-4 p-2">
              <FaRegClock /> {cookingTime}
            </p>
          </>
        )}
      </div>
      <hr />

      <div className="flex items-center justify-around p-2 text-sm relative">
        <div>
          <FaShare onClick={toggleDropdown} className="cursor-pointer" />
        </div>
        <p>
          <GoStar
            className={`cursor-pointer ${is_favorite ? "text-yellow-500" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
          />
        </p>
        <p
          onClick={(e) => {
            e.stopPropagation();
            deleteRecipe(id);
          }}
          className="cursor-pointer"
        >
          <FaTrash />
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
