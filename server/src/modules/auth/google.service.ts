import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { googleOAuthClient } from "../../config/google.js";
import {
  deletePendingGoogleRegistration,
  generateGoogleRegistrationToken,
  generateGoogleState,
  getPendingGoogleRegistration,
  storeGoogleState,
  storePendingGoogleRegistration,
  verifyAndDeleteGoogleState,
  type GoogleOAuthIntent,
} from "../../utils/googleOAuth.js";
import { locationService } from "../locations/location.service.js";
import { userRepository } from "../users/user.repository.js";
import { toUserResponse } from "../users/user.mapper.js";

const GOOGLE_SCOPES = ["openid", "email", "profile"];

type GoogleUser = {
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
  emailVerified: boolean;
};

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

    if (googleUser.intent === "login") {
      const user = await this.loginUser(googleUser);

      const token = this.createJwt(user);

      return {
        type: "login" as const,
        user: toUserResponse(user),
        token,
      };
    }

    const registrationToken =
      await this.createPendingGoogleRegistration(googleUser);

    return {
      type: "registration" as const,
      registrationToken,
    };
  },

  async loginUser(googleUser: GoogleUser) {
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

  async createPendingGoogleRegistration(googleUser: GoogleUser) {
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

    const registrationToken = generateGoogleRegistrationToken();

    await storePendingGoogleRegistration(registrationToken, {
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      emailVerified: googleUser.emailVerified,
    });

    return registrationToken;
  },

  async completeGoogleRegistration(
    registrationToken: string,
    communityId: number,
    buildingId: number,
    unitId: number,
  ) {
    const pendingRegistration =
      await getPendingGoogleRegistration(registrationToken);

    if (!pendingRegistration) {
      throw new Error(
        "Google registration session is invalid or expired. Please register again.",
      );
    }

    const location = await locationService.validateUnitLocation(
      unitId,
      buildingId,
      communityId,
    );

    const existingGoogleUser = await userRepository.findByGoogleId(
      pendingRegistration.googleId,
    );

    if (existingGoogleUser) {
      throw new Error(
        "An account with this Google account already exists. Please login.",
      );
    }

    const existingEmailUser = await userRepository.findByEmail(
      pendingRegistration.email,
    );

    if (existingEmailUser) {
      throw new Error(
        "An account with this email already exists. Please login.",
      );
    }

    const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);

    const user = await userRepository.create({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash,
      googleId: pendingRegistration.googleId,
      role: "RESIDENT",
      emailVerified: true,
      unitId: location.id,
      communityId,
    });

    await deletePendingGoogleRegistration(registrationToken);

    const token = this.createJwt(user);

    return {
      user: toUserResponse(user),
      token,
    };
  },

  createJwt(user: { id: number; role: string; tokenVersion: number }) {
    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
  },
};
