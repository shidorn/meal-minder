"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGroceryContext } from "@/context/GroceryContext";
import RecipeCard from "@/app/components/cards/RecipeCards";
import Modal from "@/app/components/modal/Modal";
import { FaPlus } from "react-icons/fa";
import SearchBar from "@/app/components/search-bar/SearchBar";
import {
  checkTokenExpiration,
  getAccessToken,
  logout,
  setupTokenExpirationCheck,
} from "@/app/auth";
import { removeProperty } from "@/app/utils/removeProperty";

interface Ingredient {
  ingredient_name: string;
  ingredient_quantity: number;
}

interface RecipeProps {
  recipe_id: number;
  recipe_name: string;
  description: string;
  instruction: string;
  photo_path: string;
  cooking_time: string;
  recipe_ingredients: Ingredient[];
}

const Recipes: React.FC = () => {
  const router = useRouter();
  const { groceryItems } = useGroceryContext();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<RecipeProps[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(
    null
  );
  const [newRecipe, setNewRecipe] = useState<RecipeProps>({
    recipe_id: 0,
    recipe_name: "",
    description: "",
    instruction: "",
    photo_path: "",
    cooking_time: "",
    recipe_ingredients: [],
  });
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/recipes/recipe-list",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        const responseData: RecipeProps[] = response.data;
        const uniqueRecipe = new Set(recipes.map((item) => item.recipe_id));
        responseData.forEach((item) => {
          if (!uniqueRecipe.has(item.recipe_id)) {
            recipes.push(item);
          }
        });
        setRecipes((recipes) => [...recipes]);
      } catch (error) {
        console.log(error);
        logout();
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const availableRecipes = recipes.filter((recipe) => {
    return recipe.recipe_ingredients.every((ingredient) => {
      const item = groceryItems.find(
        (groceryItem) =>
          groceryItem.name.toLowerCase() ===
          ingredient.ingredient_name.toLowerCase()
      );
      return item && item.quantity >= ingredient.ingredient_quantity;
    });
  });

  console.log(
    availableRecipes.filter((recipe) =>
      recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredRecipes = availableRecipes.filter((recipe) =>
    recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecipe = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRecipe({
      recipe_id: 0,
      recipe_name: "",
      description: "",
      instruction: "",
      photo_path: "",
      cooking_time: "",
      recipe_ingredients: [],
    });
    setImagePreview(null);
  };

  const handleDeleteRecipe = (recipe: RecipeProps) => {
    setSelectedRecipe(recipe);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteRecipe = () => {
    if (selectedRecipe) {
      setRecipes(
        recipes.filter(
          (recipe) => recipe.recipe_id !== selectedRecipe.recipe_id
        )
      );
      setIsDeleteModalVisible(false);
      setSelectedRecipe(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.recipe_ingredients, { name: "", quantity: 1 }],
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const ingredients = [...newRecipe.recipe_ingredients];
    ingredients[index] = { ...ingredients[index], [field]: value };
    setNewRecipe((prev) => ({ ...prev, ingredients }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFile(selectedFile);
        newRecipe.photo_path = "/images/" + selectedFile.name;
        // setNewRecipe((prev) => ({ ...prev, photo: reader.result as string }));
      };
      console.log(selectedFile);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSaveRecipe = async () => {
    const newForm = removeProperty(newRecipe, "recipe_id");
    const newErrors: string[] = [];

    newRecipe.recipe_ingredients.forEach((ingredient, index) => {
      if (ingredient.ingredient_quantity <= 0) {
        newErrors.push(
          `Ingredient ${index + 1} must have a quantity greater than 0.`
        );
      }
    });
    console.log(newForm);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/recipes/add-recipe",
      newForm
    );

    if (!file) {
      return;
    }

    const imgFile = new FormData();
    imgFile.append("imgFile", file);
    if (response.status === 201) {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/recipes/image",
        imgFile,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);
    }

    setRecipes([...recipes, { ...newRecipe, recipe_id: recipes.length + 1 }]);
    setNewRecipe({
      recipe_id: 0,
      recipe_name: "",
      description: "",
      instruction: "",
      photo_path: "",
      cooking_time: "",
      recipe_ingredients: [],
    });
    setIsModalOpen(false);
    setImagePreview(null);
  };

  const toggleFavorite = (recipeId: string) => {
    if (isRecipeFavorite(recipeId)) {
      setFavoriteRecipes(favoriteRecipes.filter((id) => id !== recipeId));
    } else {
      setFavoriteRecipes([...favoriteRecipes, recipeId]);
    }
  };

  const isRecipeFavorite = (recipeId: string) => {
    return favoriteRecipes.includes(recipeId);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Available Recipes</h1>
          <div className="flex items-center">
            <div className="mr-72">
              <SearchBar onSearch={() => {}} />
            </div>
          </div>
        </div>
        <hr className="mb-4" />
        <div className="flex flex-col">
          <div className="self-end">
            <button
              className="bg-red-900 hover:bg-red-800 text-white py-2 px-4 text-sm rounded"
              onClick={handleAddRecipe}
            >
              Add Recipe
            </button>
          </div>
        </div>
        {recipes.length === 0 ? (
          <p>No recipes can be made with the current inventory.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                id={recipe.recipe_id.toString()}
                name={recipe.recipe_name}
                ingredients={recipe.recipe_ingredients}
                image={recipe.photo_path}
                cookingTime={recipe.cooking_time}
                deleteRecipe={() => handleDeleteRecipe(recipe)}
                toggleFavorite={() =>
                  toggleFavorite(recipe.recipe_id.toString())
                }
                isFavorite={isRecipeFavorite(recipe.recipe_id.toString())}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="z-50">
          <h2 className="text-2xl text-center text-red-900 font-bold mb-6">
            Add New Recipe
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700">Recipe Name</label>
            <input
              type="text"
              name="recipe_name"
              value={newRecipe.recipe_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Recipe Description</label>
            <input
              type="text"
              name="description"
              value={newRecipe.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Instructions</label>
            <input
              type="text"
              name="instruction"
              value={newRecipe.instruction}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview as string}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cooking Time</label>
            <input
              type="text"
              name="cooking_time"
              value={newRecipe.cooking_time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold">Ingredients</h3>
            {newRecipe.recipe_ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={ingredient.ingredient_name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                >
                  <option value="" disabled>
                    Select Ingredient
                  </option>
                  {groceryItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  value={ingredient.ingredient_quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                  placeholder="Quantity"
                />
              </div>
            ))}
            <div className="flex gap-2 mb-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                onClick={handleAddIngredient}
              >
                <FaPlus className="w-2" />
                <p>Add Ingredient</p>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={handleSaveRecipe}
            >
              Save Recipe
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      >
        <div className="p-4">
          <p className="text-xl font-bold mb-10 text-center">
            Are you sure you want to delete {selectedRecipe?.recipe_name}?
          </p>
          <div className="flex justify-end">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4"
              onClick={() => setIsDeleteModalVisible(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded"
              onClick={confirmDeleteRecipe}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Recipes;
