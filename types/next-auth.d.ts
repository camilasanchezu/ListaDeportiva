import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    roles?: string[]; // <-- Roles are on session level
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
  }
}
