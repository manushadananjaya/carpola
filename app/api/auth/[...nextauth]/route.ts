import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Check if admin credentials match
        if (
          credentials.email === "admin@vahanasale.lk" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin",
            username: "Admin",
            email: credentials.email,
            isAdmin: true,
          } as any;
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
          where: { userEmail: credentials.email },
        });

        if (user && user.password) {
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
    async signIn({ user }) {
      console.log("user in signIn callback", user);
      return true;
    },
    async session({ session, token }) {
      // Check if token properties exist and set them in session
      session.user = {
        id: token.id as number,
        username: token.username as string,
        email: token.email as string,
        userPhone: token.phone as string,
        city: token.city as string,
        district: token.district as string,
        isAdmin: token.isAdmin as boolean, // Set isAdmin in session
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
        token.isAdmin = (user as any).isAdmin ?? false;

        // Set redirect URL in token if the user is an admin
        if (token.isAdmin) {
          token.redirectUrl = "/admin/dashboard";
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Use token.redirectUrl if it exists for admin users
      return url.startsWith("/")
        ? `${baseUrl}${url}`
        : `${baseUrl}/admin/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
