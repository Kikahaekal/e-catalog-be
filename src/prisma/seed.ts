import { connectDatabase, db } from "./db.ts";

const users = [
  {
    email: "superadmin@example.com",
    name: "Super Admin",
    // Hash password dummy (contoh: "password123")
    password: "$2b$10$eImiTXuWVxfM37uY4JANjOL.88448rG8LhE/2S5kP/w6QzG/Z4m/2",
    role: "ADMIN" as const,
  }
];

let pendingSeed: Promise<void> | undefined;

async function runSeed(): Promise<void> {
  console.log("Seeding users...");
  await connectDatabase();

  for (const user of users) {
    await db.orm.public.User.upsert({
      create: user,
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
      },
      conflictOn: { email: user.email },
    });
  }

  console.log("Users seeded successfully!");
}

export function seed(): Promise<void> {
  pendingSeed ??= runSeed().catch((error: unknown) => {
    pendingSeed = undefined;
    throw error;
  });
  return pendingSeed;
}

// Auto-run jika script dipanggil langsung (e.g. `tsx seed.ts`)
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.endsWith("seed.ts")) {
  seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
}