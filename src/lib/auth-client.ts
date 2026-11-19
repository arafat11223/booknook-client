"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://booknote-server-cjcu.onrender.com"
    : "http://localhost:5000");

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [jwtClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;