import React, { useState } from "react";
import Image from "next/image";
import { FaRegClock, FaShare, FaTrash } from "react-icons/fa";
import { GoStar } from "react-icons/go";

interface RecipeCardProps {
  id: string;
  name: string;
  ingredients: { name: string; quantity: number }[];
  image: string;
  cookingTime: string;
  deleteRecipe: (id: string) => void;
  toggleFavorite: () => void;
  isFavorite: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  name,
  ingredients,
  image,
  cookingTime,
  deleteRecipe,
  toggleFavorite,
  isFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

  return (
    <div
      className="card mb-4 border rounded-lg shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
                isFavorite ? "bg-yellow-500" : "bg-gray-700"
              }`}
              onClick={toggleFavorite}
            >
              <GoStar className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      <h2 className="text-md font-bold mb-2 text-center">
        {name.toUpperCase()}
      </h2>

      <h3 className="text-md mt-2 p-2">Ingredients:</h3>
      <ul className="list-disc list-inside">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name} - {ingredient.quantity}
          </li>
        ))}
      </ul>
      <p className="flex items-center text-sm gap-2 mt-2 text-gray-400 mb-4 p-2">
        <FaRegClock /> {cookingTime}
      </p>
      <hr />
      <div className="flex items-center justify-around p-2 text-sm relative">
        <div>
          <FaShare onClick={toggleDropdown} className="cursor-pointer" />
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
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
        </div>
        <p>
          <GoStar
            className={`cursor-pointer ${isFavorite ? "text-yellow-500" : ""}`}
            onClick={toggleFavorite}
          />
        </p>
        <p onClick={() => deleteRecipe(id)} className="cursor-pointer">
          <FaTrash />
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
