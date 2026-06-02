import { DEFAULT_CATEGORIES } from "./categories";
import { HABIT_COLORS } from "./habits";
import type { GuestSnapshot } from "../utils/guestSession";
import { DEFAULT_HABIT_WEEKS } from "../utils/habit";
import type { Task } from "../types/task";
import { toDateString } from "../utils/date";

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function getGuestDemoSnapshot(): GuestSnapshot {
  const today = toDateString();
  const tomorrow = offsetDate(1);
  const yesterday = offsetDate(-1);

  const taskToday: Task = {
    id: "guest-task-1",
    title: "수업 준비 자료 정리",
    completed: false,
    priority: "high",
    category: "수업 준비",
    dueDate: today,
    createdAt: new Date().toISOString(),
  };
  const taskTodayDone: Task = {
    id: "guest-task-2",
    title: "아침 인사 나누기",
    completed: true,
    priority: "medium",
    category: "업무 처리",
    dueDate: today,
    createdAt: new Date().toISOString(),
  };
  const taskUpcoming: Task = {
    id: "guest-task-3",
    title: "학부모 상담 일정 확인",
    completed: false,
    priority: "medium",
    category: "학부모 상담",
    dueDate: tomorrow,
    createdAt: new Date().toISOString(),
  };
  const taskNoDue: Task = {
    id: "guest-task-4",
    title: "생활기록부 메모",
    completed: false,
    priority: "low",
    category: "생활기록부",
    createdAt: new Date().toISOString(),
  };
  const taskDone: Task = {
    id: "guest-task-5",
    title: "평가 계획 초안",
    completed: true,
    priority: "low",
    category: "평가 계획",
    dueDate: yesterday,
    createdAt: new Date().toISOString(),
  };

  const habitId = "guest-habit-1";

  return {
    tasks: [taskToday, taskTodayDone, taskUpcoming, taskNoDue, taskDone],
    userMode: "teacher",
    categories: {
      teacher: [...DEFAULT_CATEGORIES.teacher],
      parent: [...DEFAULT_CATEGORIES.parent],
    },
    todayOrder: [taskToday.id, taskNoDue.id],
    upcomingOrder: [taskUpcoming.id],
    teacherTimetable: [
      {
        id: "guest-tt-1",
        dayOfWeek: 0,
        startTime: "09:00",
        endTime: "09:45",
        title: "국어",
        note: "3학년 2반",
      },
      {
        id: "guest-tt-2",
        dayOfWeek: 2,
        startTime: "13:00",
        endTime: "13:40",
        title: "창체",
      },
    ],
    parentTimetable: [],
    teacherHabits: [
      {
        id: habitId,
        name: "아침 독서",
        description: "매일 15분",
        icon: "📖",
        color: HABIT_COLORS[0],
        frequency: "daily",
        weekCount: DEFAULT_HABIT_WEEKS,
        createdAt: new Date().toISOString(),
      },
    ],
    parentHabits: [],
    habitCompletions: {
      [habitId]: [yesterday, today],
    },
  };
}
