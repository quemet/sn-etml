export interface AuthUser {
  _id: string
  username: string
  email: string
  bio?: string | null
  avatar?: string | null
  followers?: string[]
  following?: string[]
  isActive?: boolean
  role?: 'user' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  username: string
  email: string
  password: string
}
