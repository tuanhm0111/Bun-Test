export interface User {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}