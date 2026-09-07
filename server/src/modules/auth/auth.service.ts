import bcrypt from "bcrypt"
import type { RegisterInput } from "./auth.types.js"
import { userRepository } from "../users/user.repository.js";

export const authService ={
    async register(data: RegisterInput){
        const passwordHash = await bcrypt.hash(data.password,10);

        return userRepository.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
        });
    },
};