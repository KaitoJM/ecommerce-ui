import type { User } from "./User.types";

export type Gender = "male" | "female";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: Gender;
  birthday: string;
  phone: string;
  user_id: string;
  user: User;
  created_at: string;
}

export interface CustomerListItem {
  id: string;
  name: string;
  gender: Gender;
  birthday: string;
  phone: string;
  user_id: string;
  user: User;
  created_at: string;
}
