import { getServerSession } from "next-auth/next";
import prisma from "./prisma";
import { authOptions } from "./auth";

export async function getCurrentDbUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.upsert({
    where: {
      email: session.user.email,
    },
    update: {
      fullName: session.user.name?.trim() || session.user.email.split("@")[0],
      profileImageUrl: session.user.image || null,
    },
    create: {
      email: session.user.email,
      fullName: session.user.name?.trim() || session.user.email.split("@")[0],
      passwordHash: "oauth-google",
      profileImageUrl: session.user.image || null,
      role: "USER",
    },
  });
}
