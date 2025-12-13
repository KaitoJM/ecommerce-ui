import type { Category } from "./Category.types";

interface ProductSpecification {
  id: string;
  combination: string;
  product_id: string;
  price: number;
  stock: number;
  default: boolean;
  sale: boolean;
  sale_price?: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  summary: string;
  description: string;
  published: string;
  thumbnail?: string;
  categories: Category[];
  specification?: ProductSpecification;
  created_at: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  summary: string;
  thumbnail?: string;
  published: boolean;
  price: number;
  sku: string;
  stock: number;
  categories: string[];
  created_at: string;
}
