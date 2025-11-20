export interface AuthResponseBody<T> {
  description: string;
  data: T;
}

export interface OtpBodyData {
  id: number; // Changed from string to number to match API
  email: string;
  role: string;
  fullName: string;
  profilePicture: string | null;
  phone?: string;
  address?: string;
}

export interface RegisterBodyData {
  id: number;
  fullName: string;
}
