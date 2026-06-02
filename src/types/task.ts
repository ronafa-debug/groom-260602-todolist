export type Priority = "high" | "medium" | "low";

export type UserMode = "teacher" | "parent";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
}
