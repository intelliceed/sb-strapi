// outsource dependencies
import { SessionOptions } from "iron-session";

export interface SessionData {
  jwt: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  jwt: "",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "iron-session",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production"
  },
};

export function sleep (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
