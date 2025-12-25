export type Role = "admin" | "staff" | "customer" | "courier";

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type UserInfo = {
  name?: string;
  email?: string;
};
