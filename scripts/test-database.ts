import "dotenv/config";
import prisma from "../src/lib/prisma";

async function testDatabase() {
  console.log("Testing Prisma Postgres connection...\n");

  try {
    const demoEmail = `demo-${Date.now()}@example.com`;

    console.log("Creating a test user...");
    const newUser = await prisma.user.upsert({
      where: {
        email: demoEmail,
      },
      update: {
        fullName: "Demo User",
      },
      create: {
        email: demoEmail,
        fullName: "Demo User",
        passwordHash: "$2b$12$exampleHashOnlyForTestingAndNotForAuthentication",
        role: "USER",
      },
    });
    console.log("Created user:", newUser);

    console.log("\nFetching all users...");
    const allUsers = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${allUsers.length} user(s):`);
    allUsers.forEach((user) => {
      console.log(`- ${user.fullName} (${user.email})`);
    });

    console.log("\nAll tests passed.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

void testDatabase();
