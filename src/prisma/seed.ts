import { connectDatabase, db } from "./db.ts";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const users = [
  {
    email: "admin@example.com",
    name: "Super Admin",
    // Hash password dummy (contoh: "password123")
    password: bcrypt.hashSync("admin123", SALT_ROUNDS),
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