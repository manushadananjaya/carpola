// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// You can add other providers like GitHub, etc.

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Callbacks, sessions, etc. can be added here for further customization
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom logic after sign-in
      console.log("User signed in:", user);
      return true;
    },
  },
});

export { handler as GET, handler as POST };
