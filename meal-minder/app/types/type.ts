export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  isPurchased: boolean;
}

export interface Recipe {
  recipe_id: number;
  recipe_name: string;
  description: string;
  instruction: string;
  photo_path: string;
  cooking_time: string;
  is_favorite: boolean;
}

export interface FamilyMember {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}
