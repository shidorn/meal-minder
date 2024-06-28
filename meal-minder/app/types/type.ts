export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  isPurchased: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string; quantity: number }[];
}
