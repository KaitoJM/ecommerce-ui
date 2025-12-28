import type { Customer } from "./Customer.types";
import type { Product, ProductSpecification } from "./Product.types";
import type { User } from "./User.types";

export interface OrderStatus {
  id: string;
  status: string;
  color_code: string;
  description: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer?: Customer;
  session_id: string;
  cart_id: string;
  status_id: string;
  status?: OrderStatus;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  order: Order;
  product_id: string;
  product: Product;
  product_specification_id: string;
  product_specification: ProductSpecification;
  product_snapshot_name: string;
  product_snapshot_price: string;
  quantity: number;
  total: number;
  created_at: string;
}

export interface OrderItemListItem {
  id: string;
  order_id: string;
  product_id: string;
  product_specification_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  specification: string;
  quantity: number;
  total: number;
  created_at: string;
}
