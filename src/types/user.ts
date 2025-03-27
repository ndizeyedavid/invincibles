export interface CreateUser {
  user_id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  avatar: string | null;
}

export interface UpdateUser {
  user_id: string;
  name: string;
  phoneNumber: string | null;
  avatar: string | null;
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  google_id?: string;
  isVerified: boolean;
  phoneNumber?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date;
  status: string;
}
