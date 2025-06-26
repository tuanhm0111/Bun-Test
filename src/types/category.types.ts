export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
}