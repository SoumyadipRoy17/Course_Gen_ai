// /app/api/auth/[...nextauth]/route.js (for Next.js 13+ with App Router)
// or /pages/api/auth/[...nextauth].js (for Pages Router)

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
