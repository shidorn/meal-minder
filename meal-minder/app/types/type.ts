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
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}
