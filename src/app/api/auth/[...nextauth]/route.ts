import NextAuth from "next-auth";
import { authOptions } from "@/src/lib/auth";

const handler = NextAuth(authOptions);

// Sa App Router, kailangan i-export ang GET at POST
export { handler as GET, handler as POST };
