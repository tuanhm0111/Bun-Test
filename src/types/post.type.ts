import type { User } from "./user.types";
import type { Category } from "./category.types";

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured: boolean;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  categoryId: number;

  // Relations (optional, khi có populate)
  author?: User;
  category?: Category;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  featured?: boolean;
  status?: PostStatus;
  categoryId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  featured?: boolean;
  status?: PostStatus;
  categoryId?: number;
}

export interface PostResponse {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  featured: boolean;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  author: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
}
