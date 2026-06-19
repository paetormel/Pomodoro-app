// hooks/useTodoMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/src/app/generated/prisma/client";
import {
  createTodo,
  deleteTodo,
  reorderTodos,
  toggleTodo,
} from "../services/todo.service";

export function useTodoMutations() {
  const queryClient = useQueryClient();

  const getTodos = () => queryClient.getQueryData<Todo[]>(["todos"]) ?? [];

  const cancelAndSnapshot = async () => {
    await queryClient.cancelQueries({ queryKey: ["todos"] });
    return { previous: getTodos() };
  };

  const rollback = (_err: unknown, _vars: unknown, context?: { previous: Todo[] }) => {
    if (context?.previous) {
      queryClient.setQueryData(["todos"], context.previous);
    }
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["todos"] });

  // ─── CREATE ───────────────────────────────────────────────────────────────

  const create = useMutation({
    mutationFn: ({ title, sortOrder }: { title: string; sortOrder: number }) =>
      createTodo(title, sortOrder),

    onMutate: async ({ title, sortOrder }) => {
      const context = await cancelAndSnapshot();

      const tempTodo: Todo = {
        id: `temp-${Date.now()}`,
        title,
        isCompleted: false,
        sortOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
      };

      queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [
        ...old,
        tempTodo,
      ]);

      return context;
    },

    onError: rollback,
    onSettled: invalidate,
  });

  // ─── TOGGLE ───────────────────────────────────────────────────────────────

  const toggle = useMutation({
    mutationFn: (data: { id: string; isCompleted: boolean }) =>
      toggleTodo(data.id, data.isCompleted),

    onMutate: async ({ id, isCompleted }) => {
      const context = await cancelAndSnapshot();

      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, isCompleted } : t))
      );

      return context;
    },

    onError: rollback,
    onSettled: invalidate,
  });

  // ─── DELETE ───────────────────────────────────────────────────────────────

  const remove = useMutation({
    mutationFn: (id: string) => deleteTodo(id),

    onMutate: async (id) => {
      const context = await cancelAndSnapshot();

      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.filter((t) => t.id !== id)
      );

      return context;
    },

    onError: rollback,
    onSettled: invalidate,
  });

  // ─── REORDER ──────────────────────────────────────────────────────────────

  const reorder = useMutation({
    mutationFn: (ids: string[]) => reorderTodos(ids),
    onError: rollback,
    onSettled: invalidate,
  });

  return { create, toggle, remove, reorder };
} 