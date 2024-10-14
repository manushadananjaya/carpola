// next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default session object to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      username: string;
      district: string;
      city: string;
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userPhone?: string | null;
      userCity?: string | null;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    userPhone?: string | null;
    userCity?: string | null;
  }
}

// Extend the default JWT object to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id: number;
  }
}
