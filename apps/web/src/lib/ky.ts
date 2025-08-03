import { isServer } from "@tanstack/react-query";
import ky from "ky";
import { authToken } from "@/constants/auth";

async function getServerCookies() {
  const { cookies } = await import("next/headers");
  const { getCookie } = await import("cookies-next/server");

  const token = await getCookie(authToken, { cookies });

  if (!token) return null;

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function setCookieHeaders(request: Request) {
  if (!isServer) return;

  const cookieHeader = await getServerCookies();

  if (cookieHeader) {
    request.headers.set("Cookie", cookieHeader);
  }
}

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  hooks: {
    beforeRequest: [setCookieHeaders],
  },
});
