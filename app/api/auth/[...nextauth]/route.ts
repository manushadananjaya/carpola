import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
        // You can replace this logic with your actual authentication
        const user = { id: 1, name: "John Doe", email: credentials?.email };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom logic after sign-in
      console.log("User signed in:", user);
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the home page or protected route after sign-in
      return baseUrl; // Redirect to home page
    },
  },
});

export { handler as GET, handler as POST };
