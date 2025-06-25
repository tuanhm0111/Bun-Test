import type { User, CreateUserDTO, UpdateUserDTO, UserResponse } from "../types";
import { userModel } from "../models/user.model";

class UserService {
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await userModel.findAll();
    return users.map(this.formatUserResponse);
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await userModel.findById(id);
    return user ? this.formatUserResponse(user) : null;
  }

  async createUser(userData: CreateUserDTO): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await userModel.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password (simplified for demo)
    const hashedPassword = `hashed_${userData.password}`;

    const newUser = await userModel.create({
      ...userData,
      password: hashedPassword,
    });

    return this.formatUserResponse(newUser);
  }

  async updateUser(
    id: number,
    userData: UpdateUserDTO
  ): Promise<UserResponse | null> {
    const updatedUser = await userModel.update(id, userData);
    return updatedUser ? this.formatUserResponse(updatedUser) : null;
  }

  async deleteUser(id: number): Promise<boolean> {
    return await userModel.delete(id);
  }

  private formatUserResponse(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }
}

export const userService = new UserService();
