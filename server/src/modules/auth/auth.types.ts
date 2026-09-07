export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
}