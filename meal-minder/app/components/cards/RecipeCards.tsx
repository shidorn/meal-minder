import React from "react";
import Image from "next/image";
import { FaRegClock, FaShare } from "react-icons/fa";
import { GoStar } from "react-icons/go";
import { FaTrash } from "react-icons/fa";

interface RecipeCardProps {
  id: string;
  name: string;
  ingredients: { name: string; quantity: number }[];
  image: string;
  cookingTime: string;
  deleteRecipe: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  name,
  ingredients,
  image,
  cookingTime,
  deleteRecipe,
}) => {
  return (
    <div className="card mb-4 border rounded-lg shadow">
      <div className="relative h-64 overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={`${name}`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
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
      <div className="flex items-center justify-around p-2 text-sm">
        <p>
          <FaShare />
        </p>
        <p>
          <GoStar />
        </p>
        <p onClick={() => deleteRecipe(id)} className="cursor-pointer">
          <FaTrash />
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
