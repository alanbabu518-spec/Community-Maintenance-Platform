import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { googleOAuthClient } from "../../config/google.js";
import {
  generateGoogleState,
  storeGoogleState,
  verifyAndDeleteGoogleState,
  type GoogleOAuthIntent,
} from "../../utils/googleOAuth.js";
import { userRepository } from "../users/user.repository.js";
import { toUserResponse } from "../users/user.mapper.js";

const GOOGLE_SCOPES = ["openid", "email", "profile"];

export const googleService = {
  async createAuthorizationUrl(intent: GoogleOAuthIntent) {
    const state = generateGoogleState();

    await storeGoogleState(state, intent);

    return googleOAuthClient.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_SCOPES,
      state,
      prompt: "select_account",
    });
  },

  async handleCallback(code: string, state: string) {
    const intent = await verifyAndDeleteGoogleState(state);

    if (!intent) {
      throw new Error("Invalid or expired OAuth state");
    }

    const { tokens } = await googleOAuthClient.getToken(code);

    if (!tokens.id_token) {
      throw new Error("Google ID token not received");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error("GOOGLE_CLIENT_ID is not defined");
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new Error("Invalid Google account information");
    }

    return {
      intent,
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? "Google User",
      picture: payload.picture ?? null,
      emailVerified: payload.email_verified === true,
    };
  },

  async handleOAuthCallback(code: string, state: string) {
    const googleUser = await this.handleCallback(code, state);

    if (!googleUser.emailVerified) {
      throw new Error("Google email is not verified");
    }

    let user;

    if (googleUser.intent === "login") {
      user = await this.loginUser(googleUser);
    } else {
      user = await this.registerUser(googleUser);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      user: toUserResponse(user),
      token,
    };
  },

  async loginUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    picture: string | null;
    emailVerified: boolean;
  }) {
    let user = await userRepository.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await userRepository.findByEmail(googleUser.email);

      if (!user) {
        throw new Error(
          "No CommunityCare account found. Please create an account first.",
        );
      }

      if (!user.googleId) {
        user = await userRepository.updateGoogleId(
          user.id,
          googleUser.googleId,
        );
      }
    }

    return user;
  },

  async registerUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    picture: string | null;
    emailVerified: boolean;
  }) {
    const existingGoogleUser = await userRepository.findByGoogleId(
      googleUser.googleId,
    );

    if (existingGoogleUser) {
      throw new Error(
        "An account with this Google account already exists. Please login.",
      );
    }

    const existingEmailUser = await userRepository.findByEmail(
      googleUser.email,
    );

    if (existingEmailUser) {
      throw new Error(
        "An account with this email already exists. Please login.",
      );
    }

    const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);

    const user = await userRepository.create({
      name: googleUser.name,
      email: googleUser.email,
      passwordHash,
      googleId: googleUser.googleId,
      role: "RESIDENT",
      emailVerified: true,
    });

    return user;
  },
};
