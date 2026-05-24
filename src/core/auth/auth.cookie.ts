import "server-only";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "access_token";

export const setAccessTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const clearAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
};

export const readAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
};
