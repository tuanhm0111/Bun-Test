import type { User, CreateUserDTO, UpdateUserDTO } from "../types";
import { generateId } from "../utils/helpers";

class UserModel {
  private users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword123",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "hashedpassword456",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const newUser: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(id: number, userData: UpdateUserDTO): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    return this.users[userIndex];
  }

  async delete(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}

export const userModel = new UserModel();
