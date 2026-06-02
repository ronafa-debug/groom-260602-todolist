import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH ?? path.join(__dirname, "data.db");

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

const defaultCategories = JSON.stringify({
  teacher: ["수업 준비", "평가 계획", "생활기록부", "학부모 상담", "업무 처리"],
  parent: ["아이와 독서", "숙제 확인", "놀이 활동", "가족 일정", "건강 관리"],
});

db.exec(`
  create table if not exists allowed_emails (
    email text primary key,
    created_at text not null default (datetime('now'))
  );

  create table if not exists users (
    id text primary key,
    email text not null unique,
    password_hash text not null,
    created_at text not null default (datetime('now'))
  );

  create table if not exists profiles (
    user_id text primary key references users(id) on delete cascade,
    user_mode text not null default 'teacher',
    categories text not null,
    today_order text not null default '[]',
    upcoming_order text not null default '[]',
    updated_at text not null default (datetime('now'))
  );

  create table if not exists tasks (
    id text primary key,
    user_id text not null references users(id) on delete cascade,
    title text not null,
    completed integer not null default 0,
    priority text not null default 'medium',
    category text not null default '',
    due_date text,
    created_at text not null,
    updated_at text not null default (datetime('now'))
  );

  create index if not exists tasks_user_id_idx on tasks(user_id);
`);

const profileColumns = db
  .prepare("PRAGMA table_info(profiles)")
  .all() as Array<{ name: string }>;
const profileColumnNames = new Set(profileColumns.map((c) => c.name));

if (!profileColumnNames.has("teacher_timetable")) {
  db.exec(
    "alter table profiles add column teacher_timetable text not null default '[]'",
  );
}
if (!profileColumnNames.has("parent_timetable")) {
  db.exec(
    "alter table profiles add column parent_timetable text not null default '[]'",
  );
}
if (!profileColumnNames.has("teacher_habits")) {
  db.exec(
    "alter table profiles add column teacher_habits text not null default '[]'",
  );
}
if (!profileColumnNames.has("parent_habits")) {
  db.exec(
    "alter table profiles add column parent_habits text not null default '[]'",
  );
}
if (!profileColumnNames.has("habit_completions")) {
  db.exec(
    "alter table profiles add column habit_completions text not null default '{}'",
  );
}

export function isEmailAllowed(email: string): boolean {
  const row = db
    .prepare("select email from allowed_emails where email = ?")
    .get(email.toLowerCase());
  return Boolean(row);
}

export function findUserByEmail(email: string) {
  return db
    .prepare("select id, email, password_hash from users where email = ?")
    .get(email.toLowerCase()) as
    | { id: string; email: string; password_hash: string }
    | undefined;
}

export function createUser(email: string, passwordHash: string): { id: string; email: string } {
  const id = crypto.randomUUID();
  const normalized = email.toLowerCase();
  db.prepare("insert into users (id, email, password_hash) values (?, ?, ?)").run(
    id,
    normalized,
    passwordHash,
  );
  db.prepare(
    "insert into profiles (user_id, user_mode, categories) values (?, 'teacher', ?)",
  ).run(id, defaultCategories);
  return { id, email: normalized };
}

export function ensureProfile(userId: string) {
  const existing = db.prepare("select user_id from profiles where user_id = ?").get(userId);
  if (!existing) {
    db.prepare(
      "insert into profiles (user_id, user_mode, categories) values (?, 'teacher', ?)",
    ).run(userId, defaultCategories);
  }
}
