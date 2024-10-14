import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configure the NextAuth options
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error("Email is required");

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
          where: { userEmail: credentials.email },
        });

        if (user) {
          // If user exists, return the user object
          return {
            id: user.userId,
            username: user.username,
            email: user.userEmail,
            city: user.userCity,
            district: user.userDistrict,
          };
        } else {
          // If the user doesn't exist or credentials are incorrect, throw an error
          throw new Error("Invalid email or password.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if the user already exists in the database
        let dbUser = await prisma.user.findUnique({
          where: { userEmail: user.email ?? "" },
        });

        // If the user does not exist, create a new one
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              username: user.name || "New User",
              userEmail: user.email || "",
              userPhone: "",
              userCity: "",
              userDistrict: "",
              isOnboarded: false,
            },
          });
        }

        // If the user is not onboarded, redirect to the onboarding page
        if (!dbUser.isOnboarded) {
          return `/auth/onboarding?email=${user.email ?? ""}`;
        } else {
          // update session user with the user id and get other user details from the database
          
          return "/";
        }
      }

      // If the account provider is not Google, allow sign-in without additional checks
      return true;
    },
    async session({ session, token }) {
      // Attach additional user information to the session object
      session.user.id = token.id as number;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.city = token.city as string;
      session.user.district = token.district as string;

      return session;
    },
    async jwt({ token, user }) {
      // Store user information in the token on the first login
      if (user) {
        token.id = Number(user.id);
        token.username = user.username;
        token.email = user.email ?? "";
        token.city = user.city;
        token.district = user.district;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

// Named export for GET and POST methods
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
