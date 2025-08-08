import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookies: {
      config: {
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      },
    },
  },
  trustedOrigins: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
});
