import { useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import type { Todo } from '@/src/app/generated/prisma/client';
import { useTodoMutations } from './userTodoMutations';

export const useTodoActions = (todos: Todo[]) => {
  const { create, toggle, remove, reorder } = useTodoMutations();
  const { status } = useSession();
  const [inputValue, setInputValue] = useState('');

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = inputValue.trim();
    if (!title) return;

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      await signIn("google", { callbackUrl: "/" });
      return;
    }

    await create.mutateAsync({ title, sortOrder: todos.length });
    setInputValue('');
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    await toggle.mutateAsync({ id, isCompleted: !target.isCompleted });
  };

  const deleteTodo = async (id: string) => {
    await remove.mutateAsync(id);
  };

  const syncOrder = async (ordered: Todo[]) => {
    await reorder.mutateAsync(ordered.map((t) => t.id));
  };

  return {
    inputValue,
    setInputValue,
    addTodo,
    toggleTodo,
    deleteTodo,
    syncOrder,
  };
};
