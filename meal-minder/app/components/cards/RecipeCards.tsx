import React, { useState } from "react";
import Image from "next/image";
import { FaRegClock, FaShare, FaTrash } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import { useInventory } from "@/context/InventoryContext";

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
  const { inventory } = useInventory();
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
<<<<<<< HEAD
  const [isFavorite, setIsFavorite] = useState(false);
=======
  const [showInstruction, setShowInstruction] = useState(false);
>>>>>>> ec488d94204682815f9c4b0137e65af905810820

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

<<<<<<< HEAD
  const handleShare = (platform: string) => {
    const recipeUrl = `${window.location.origin}/recipe/${id}`;
    if (platform === "copy") {
      navigator.clipboard.writeText(recipeUrl);
      alert("Link copied to clipboard!");
    } else if (platform === "family") {
      // Add your logic to share with family members here
      alert("Shared with family members!");
    }
    setIsDropdownOpen(false);
  };

  const handleFavorite = {};
=======
  const toggleInstruction = () => {
    setShowInstruction(!showInstruction);
  };
>>>>>>> ec488d94204682815f9c4b0137e65af905810820

  return (
    <div
      className="card grid grid-rows-2 mb-4 border rounded-lg shadow"
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
<<<<<<< HEAD
          {isDropdownOpen && (
            <div className="absolute top-full left-10 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <p
                onClick={() => handleShare("copy")}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                Copy Link
              </p>
              <p
                onClick={() => handleShare("family")}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                Share with Family Members
              </p>
            </div>
          )}
=======
>>>>>>> ec488d94204682815f9c4b0137e65af905810820
        </div>
        <p>
          <GoStar
            className={`cursor-pointer ${isFavorite ? "text-yellow-500" : ""}`}
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
