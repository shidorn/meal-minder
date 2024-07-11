import React from "react";
import { FaPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Ingredient {
  ingredient_name: string;
  ingredient_quantity: number;
}

interface AddIngredientProps {
  ingredients: Ingredient[];
  onAdd: () => void;
  onIngredientChange: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  isIngredientAvailable: (ingredientName: string) => boolean;
}

const AddIngredient: React.FC<AddIngredientProps> = ({
  ingredients,
  onAdd,
  onIngredientChange,
  isIngredientAvailable,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Ingredients</h3>
      <div className="max-h-60 overflow-y-auto">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              value={ingredient.ingredient_name}
              onChange={(e) =>
                onIngredientChange(index, "ingredient_name", e.target.value)
              }
              className={`w-1/2 p-2 border rounded ${
                isIngredientAvailable(ingredient.ingredient_name)
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              placeholder="Ingredient Name"
            />
            <input
              type="number"
              name="quantity"
              value={ingredient.ingredient_quantity}
              onChange={(e) =>
                onIngredientChange(index, "ingredient_quantity", e.target.value)
              }
              className="w-1/2 p-2 border rounded"
              placeholder="Quantity"
            />
            {isIngredientAvailable(ingredient.ingredient_name) ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
          onClick={onAdd}
        >
          <FaPlus className="w-2" />
          <p>Add Ingredient</p>
        </button>
      </div>
    </div>
  );
};

export default AddIngredient;
