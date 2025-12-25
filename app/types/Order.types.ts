import type { Customer } from "./Customer.types";
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
