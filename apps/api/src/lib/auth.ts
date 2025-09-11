import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    crossOriginCookies: {
      enabled: true,
      autoSecure: true, // Automatically set secure=true for SameSite=None
      allowLocalhostUnsecure: true, // Allow unsecure cookies on localhost for development
    },
    defaultCookieAttributes: {
      sameSite: "none", // Required for cross-domain cookies
      partitioned: true, // Recommended for modern browsers
    },
  },
  trustedOrigins: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
});
