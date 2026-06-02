import { Router } from "express";
import { db, ensureProfile } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
const defaultCategories = {
  teacher: ["수업 준비", "평가 계획", "생활기록부", "학부모 상담", "업무 처리"],
  parent: ["아이와 독서", "숙제 확인", "놀이 활동", "가족 일정", "건강 관리"],
};

export const dataRouter = Router();

dataRouter.use(requireAuth);

dataRouter.get("/", (req, res) => {
  const userId = req.user!.sub;
  ensureProfile(userId);

  const profile = db
    .prepare(
      "select user_mode, categories, today_order, upcoming_order, teacher_timetable, parent_timetable, teacher_habits, parent_habits, habit_completions from profiles where user_id = ?",
    )
    .get(userId) as
    | {
        user_mode: string;
        categories: string;
        today_order: string;
        upcoming_order: string;
        teacher_timetable: string;
        parent_timetable: string;
        teacher_habits: string;
        parent_habits: string;
        habit_completions: string;
      }
    | undefined;

  const parseTimetable = (raw?: string) => {
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const parseHabits = (raw?: string) => {
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const parseCompletions = (raw?: string) => {
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const tasks = db
    .prepare(
      "select id, title, completed, priority, category, due_date, created_at from tasks where user_id = ? order by created_at asc",
    )
    .all(userId) as Array<{
    id: string;
    title: string;
    completed: number;
    priority: string;
    category: string;
    due_date: string | null;
    created_at: string;
  }>;

  res.json({
    profile: {
      user_mode: profile?.user_mode ?? "teacher",
      categories: profile ? JSON.parse(profile.categories) : defaultCategories,
      today_order: profile ? JSON.parse(profile.today_order) : [],
      upcoming_order: profile ? JSON.parse(profile.upcoming_order) : [],
      teacher_timetable: parseTimetable(profile?.teacher_timetable),
      parent_timetable: parseTimetable(profile?.parent_timetable),
      teacher_habits: parseHabits(profile?.teacher_habits),
      parent_habits: parseHabits(profile?.parent_habits),
      habit_completions: parseCompletions(profile?.habit_completions),
    },
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: Boolean(t.completed),
      priority: t.priority,
      category: t.category,
      due_date: t.due_date,
      created_at: t.created_at,
    })),
  });
});

dataRouter.put("/profile", (req, res) => {
  const userId = req.user!.sub;
  const {
    user_mode,
    categories,
    today_order,
    upcoming_order,
    teacher_timetable,
    parent_timetable,
    teacher_habits,
    parent_habits,
    habit_completions,
  } = req.body ?? {};

  db.prepare(
    `update profiles set
      user_mode = ?,
      categories = ?,
      today_order = ?,
      upcoming_order = ?,
      teacher_timetable = ?,
      parent_timetable = ?,
      teacher_habits = ?,
      parent_habits = ?,
      habit_completions = ?,
      updated_at = datetime('now')
    where user_id = ?`,
  ).run(
    user_mode ?? "teacher",
    JSON.stringify(categories ?? {}),
    JSON.stringify(today_order ?? []),
    JSON.stringify(upcoming_order ?? []),
    JSON.stringify(teacher_timetable ?? []),
    JSON.stringify(parent_timetable ?? []),
    JSON.stringify(teacher_habits ?? []),
    JSON.stringify(parent_habits ?? []),
    JSON.stringify(habit_completions ?? {}),
    userId,
  );

  res.json({ ok: true });
});

dataRouter.post("/tasks", (req, res) => {
  const userId = req.user!.sub;
  const task = req.body ?? {};

  db.prepare(
    `insert into tasks (id, user_id, title, completed, priority, category, due_date, created_at)
     values (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    task.id,
    userId,
    task.title,
    task.completed ? 1 : 0,
    task.priority,
    task.category,
    task.due_date ?? null,
    task.created_at ?? new Date().toISOString(),
  );

  res.status(201).json({ ok: true });
});

dataRouter.put("/tasks/:id", (req, res) => {
  const userId = req.user!.sub;
  const task = req.body ?? {};

  const result = db
    .prepare(
      `update tasks set
        title = ?, completed = ?, priority = ?, category = ?, due_date = ?,
        updated_at = datetime('now')
      where id = ? and user_id = ?`,
    )
    .run(
      task.title,
      task.completed ? 1 : 0,
      task.priority,
      task.category,
      task.due_date ?? null,
      req.params.id,
      userId,
    );

  if (result.changes === 0) {
    res.status(404).json({ error: "일정을 찾을 수 없습니다." });
    return;
  }

  res.json({ ok: true });
});

dataRouter.delete("/tasks/:id", (req, res) => {
  const userId = req.user!.sub;
  db.prepare("delete from tasks where id = ? and user_id = ?").run(
    req.params.id,
    userId,
  );
  res.json({ ok: true });
});

dataRouter.post("/import", (req, res) => {
  const userId = req.user!.sub;
  const { profile, tasks } = req.body ?? {};
  ensureProfile(userId);

  if (profile) {
    db.prepare(
      `update profiles set
        user_mode = ?, categories = ?, today_order = ?, upcoming_order = ?,
        teacher_timetable = ?, parent_timetable = ?,
        teacher_habits = ?, parent_habits = ?, habit_completions = ?,
        updated_at = datetime('now')
      where user_id = ?`,
    ).run(
      profile.user_mode ?? "teacher",
      JSON.stringify(profile.categories ?? {}),
      JSON.stringify(profile.today_order ?? []),
      JSON.stringify(profile.upcoming_order ?? []),
      JSON.stringify(profile.teacher_timetable ?? []),
      JSON.stringify(profile.parent_timetable ?? []),
      JSON.stringify(profile.teacher_habits ?? []),
      JSON.stringify(profile.parent_habits ?? []),
      JSON.stringify(profile.habit_completions ?? {}),
      userId,
    );
  }

  if (Array.isArray(tasks)) {
    const insert = db.prepare(
      `insert or replace into tasks (id, user_id, title, completed, priority, category, due_date, created_at)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const tx = db.transaction((rows: typeof tasks) => {
      for (const t of rows) {
        insert.run(
          t.id,
          userId,
          t.title,
          t.completed ? 1 : 0,
          t.priority,
          t.category,
          t.due_date ?? null,
          t.created_at,
        );
      }
    });
    tx(tasks);
  }

  res.json({ ok: true });
});
