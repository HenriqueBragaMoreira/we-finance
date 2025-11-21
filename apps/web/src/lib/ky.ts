import { isServer } from "@tanstack/react-query";
import ky from "ky";

async function getServerCookies() {
  const { cookies } = await import("next/headers");

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function setCookieHeaders(request: Request) {
  if (!isServer) {
    return;
  }

  const serverCookies = await getServerCookies();
  if (serverCookies) {
    request.headers.set("Cookie", serverCookies);
  }
}

export const api = ky.create({
  prefixUrl: "/api",
  credentials: "include",
  hooks: {
    beforeRequest: [setCookieHeaders],
  },
});
