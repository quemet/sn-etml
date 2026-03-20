export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiResponseWithoutData<T = unknown> {
  success: boolean
  message: string
  data?: T
}
