import { isServer } from "@tanstack/react-query";
import type { CookieValueTypes } from "cookies-next";
import ky from "ky";
import { authToken } from "@/constants/auth";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [
      async (request): Promise<void> => {
        let token: CookieValueTypes = "";

        if (isServer) {
          const { cookies } = await import("next/headers");
          const { getCookie } = await import("cookies-next/server");

          token = await getCookie(authToken, { cookies });
        } else {
          const { getCookie } = await import("cookies-next/client");

          token = getCookie(authToken);
        }

        if (token) {
          token = token.split(".")[0];

          console.log("Token:", token);

          request.headers.set("Authorization", token);
          console.log(
            "Req Authorization Header:",
            request.headers.get("Authorization")
          );
        }
      },
    ],
  },
});
