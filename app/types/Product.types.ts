export interface ProductListItem {
  id: string;
  name: string;
  summary: string;
  thumbnail?: string;
  published: boolean;
  price: number;
  sku: string;
  stock: number;
  category: string[];
  createdAt: string;
}
