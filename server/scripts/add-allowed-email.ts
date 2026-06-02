import { db } from "../db.js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: npx tsx server/scripts/add-allowed-email.ts user@example.com");
  process.exit(1);
}

db.prepare("insert or ignore into allowed_emails (email) values (?)").run(email);
console.log(`Allowed email added: ${email}`);
