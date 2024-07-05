export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  isPurchased: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  image: string;
}

export interface FamilyMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
}
