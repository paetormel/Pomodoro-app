// services/todo.service.ts

import { Todo } from "@/src/app/generated/prisma/client";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch("/api/todos");

  if (response.status === 401) return [];

  if (!response.ok) {
    throw new Error("Failed to load todos");
  }

  return response.json();
}

export async function createTodo(title: string, sortOrder: number) {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, sortOrder }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(
      errorBody?.error || `Failed to create todo (${response.status})`
    );
  }

  return response.json();
}

export async function toggleTodo(id: string, isCompleted: boolean) {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted }),
  });

  if (!response.ok) throw new Error("Failed to update todo");
}

export async function deleteTodo(id: string) {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete todo");
}

export async function reorderTodos(ids: string[]) {
  const response = await fetch("/api/todos/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) throw new Error("Failed to reorder todos");
}
