export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  expiresIn: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}