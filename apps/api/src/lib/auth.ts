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
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      domain:
        process.env.NODE_ENV === "production"
          ? "we-finance-api.onrender.com"
          : undefined,
      path: "/",
      partitioned: true,
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: "we-finance-api.onrender.com",
    },
  },
  trustedOrigins: [process.env.CLIENT_ORIGIN || "http://localhost:3000"],
});
