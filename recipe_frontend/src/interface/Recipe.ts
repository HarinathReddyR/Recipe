// src/interface/Recipe.ts
export interface Recipe {
  rating: number;
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
  directions:string[];
  categories: string[];
  calories: number;
  fat: number;
  protein: number;
  sodium: number;
  imageUrl: string;
  date: string; 
}
