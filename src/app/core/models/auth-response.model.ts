export interface AuthResponseBody<T> {
    description: string,
    data: T
}

export interface OtpBodyData {
    id: string;
    email: string;
    role: string;
}
export interface RegisterBodyData {
    id: number;
    fullName: string;
}

