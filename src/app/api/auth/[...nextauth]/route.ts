import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Dagdag na config para maiwasan ang error
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  // Ito ang tutulong sa atin mag-debug sa terminal kung may error pa
  debug: process.env.NODE_ENV === "development",
  
  // Importante ito para sa App Router
  session: {
    strategy: "jwt",
  },
});

// Sa App Router, kailangan i-export ang GET at POST
export { handler as GET, handler as POST };