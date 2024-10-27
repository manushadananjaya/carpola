import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Configure the NextAuth options
export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Check if admin is logging in with hardcoded credentials
        if (
          credentials.email === "admin@vahanasale.lk" &&
          credentials.password === "admin123"
        ) {
          return {
            id: 1,
            username: "Admin",
            email: "admin@vahanasale.lk",
            phone: "",
            city: "",
            district: "",
            isAdmin: true,
          };
        }

        // Fetch the user from the database for non-admin users
        const user = await prisma.user.findUnique({
          where: { userEmail: credentials.email },
        });

        if (user && user.password) {
          // Verify the password using bcrypt
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isValid) {
            return {
              id: user.userId,
              username: user.username,
              email: user.userEmail,
              phone: user.userPhone,
              city: user.userCity,
              district: user.userDistrict,
              isAdmin: false,
            };
          }
        }

        throw new Error("Invalid email or password.");
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        let dbUser = await prisma.user.findUnique({
          where: { userEmail: user.email ?? "" },
        });

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

        if (!dbUser.isOnboarded) {
          return `/auth/onboarding?email=${user.email ?? ""}`;
        }

        return true;
      }

      return true;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        username: token.username as string,
        email: token.email as string,
        userPhone: token.phone as string,
        city: token.city as string,
        district: token.district as string,
        isAdmin: token.isAdmin as boolean,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.username = user.username;
        token.email = user.email ?? "";
        token.phone = user.phone ?? "";
        token.city = user.city;
        token.district = user.district;
        token.isAdmin = user.isAdmin;
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { userEmail: token.email },
        });

        if (dbUser) {
          token.id = dbUser.userId;
          token.username = dbUser.username;
          token.phone = dbUser.userPhone;
          token.city = dbUser.userCity;
          token.district = dbUser.userDistrict;
          token.isAdmin = dbUser.userEmail === "admin@vahanasale.lk";
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
};
