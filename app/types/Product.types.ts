import type { Attribute } from "./Attribute.types";
import type { Category } from "./Category.types";

export interface Combination {
  product_attribute_id: string;
  attribute_id: string;
  value: string;
}
export interface ProductSpecification {
  id: string;
  combination?: Combination[];
  product_id: string;
  price: number;
  stock: number;
  default: boolean;
  sale: boolean;
  sale_price?: number;
  images: string[];
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

export interface ProductImage {
  id: string;
  product_id: string;
  source: string;
  cover: boolean;
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_id: string;
  value: string;
  color_value: string;
  attribute?: Attribute;
}
