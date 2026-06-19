import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../services/todo.service";
import type { Todo } from "@/src/app/generated/prisma/client";

export function useTodos() {
  const { data, isLoading, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  return {
    todos: data ?? [],
    isLoading,
    error,
  };
}