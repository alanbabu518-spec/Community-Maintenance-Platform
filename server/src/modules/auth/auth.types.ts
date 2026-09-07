export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
}

export interface LoginInput {
    email: string;
    password:  string;
}