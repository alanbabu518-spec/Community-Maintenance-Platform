import bcrypt from "bcrypt"
import type { LoginInput, RegisterInput } from "./auth.types.js"
import { userRepository } from "../users/user.repository.js";
import jwt from "jsonwebtoken";

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

    async login(data: LoginInput){
        const user = await userRepository.findByEmail(data.email);

        if(!user){
            throw new Error("Inalid Email or Password");
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        if(!isPasswordValid){
            throw new Error("Invalid Email or Password");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h",
            }
        )

        return {
            user,
            token,
        };
    },
};