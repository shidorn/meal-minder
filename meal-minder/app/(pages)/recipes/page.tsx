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

interface Ingredient {
  name: string;
  quantity: number;
}

interface RecipeProps {
  id: string;
  name: string;
  image: string;
  ingredients: Ingredient[];
  cookingTime: string;
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
    id: "",
    name: "",
    image: "",
    ingredients: [],
    cookingTime: "",
  });
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   }

  //   axios
  //     .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then(() => setLoading(false))
  //     .catch((error) => {
  //       console.log(error);
  //       router.push("/login");
  //     });
  // }, [router]);

  const availableRecipes = recipes.filter((recipe) => {
    return recipe.ingredients.every((ingredient) => {
      const item = groceryItems.find(
        (groceryItem) =>
          groceryItem.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      return item && item.quantity >= ingredient.quantity;
    });
  });

  const filteredRecipes = availableRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecipe = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRecipe({
      id: "",
      name: "",
      image: "",
      ingredients: [],
      cookingTime: "",
    });
    setImagePreview(null);
  };

  const handleDeleteRecipe = (recipe: RecipeProps) => {
    setSelectedRecipe(recipe);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteRecipe = () => {
    if (selectedRecipe) {
      setRecipes(recipes.filter((recipe) => recipe.id !== selectedRecipe.id));
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
      ingredients: [...prev.ingredients, { name: "", quantity: 1 }],
    }));
  };

  const handleIngredientChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const ingredients = [...newRecipe.ingredients];
    ingredients[index] = { ...ingredients[index], [name]: value };
    setNewRecipe((prev) => ({ ...prev, ingredients }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewRecipe((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRecipe = () => {
    setRecipes([
      ...recipes,
      { ...newRecipe, id: (recipes.length + 1).toString() },
    ]);
    setNewRecipe({
      id: "",
      name: "",
      image: "",
      ingredients: [],
      cookingTime: "",
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
        {availableRecipes.length === 0 ? (
          <p>No recipes can be made with the current inventory.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                ingredients={recipe.ingredients}
                image={recipe.image}
                cookingTime={recipe.cookingTime}
                deleteRecipe={() => handleDeleteRecipe(recipe)}
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
              name="name"
              value={newRecipe.name}
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
              name="cookingTime"
              value={newRecipe.cookingTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Ingredients</h3>
            {newRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, e)}
                  className="w-1/2 p-2 border rounded"
                  placeholder="Ingredient Name"
                />
                <input
                  type="number"
                  name="quantity"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, e)}
                  className="w-1/2 p-2 border rounded"
                  placeholder="Quantity"
                />
              </div>
            ))}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
              onClick={handleAddIngredient}
            >
              <FaPlus className="w-2" />
              <p>Add</p>
            </button>
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
            Are you sure you want to delete {selectedRecipe?.name}?
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
