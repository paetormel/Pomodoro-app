'use client';

import React from 'react';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { RiListCheck2 } from 'react-icons/ri';

import { useTodos } from '../hooks/useTodos';
import type { Todo } from '@/src/app/generated/prisma/client';

import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import TodoEmptyState from './TodoEmptyState';
import { useTodoActions } from '../hooks/useTodoActions';

interface TodoListProps {
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const TodoList = ({ constraintsRef }: TodoListProps) => {
  const { todos, isLoading, error } = useTodos();
  const {
    inputValue,
    setInputValue,
    addTodo,
    toggleTodo,
    deleteTodo,
    syncOrder,
  } = useTodoActions(todos);

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const showEmptyState = isLoading || todos.length === 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        className="pointer-events-auto absolute p-5 rounded-4xl border border-white/20 bg-[#282828]/90 backdrop-blur-2xl shadow-2xl w-95 h-[90vh] flex flex-col"
        style={{ top: '2%', right: '2%' }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5 px-2 shrink-0">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiListCheck2 size={24} />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
              Daily Tasks
            </span>
          </div>
        </div>

        {/* INPUT */}
        <TodoInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={addTodo}
        />

        {/* LIST */}
        <div className="bg-[#181818] rounded-2xl p-2 flex-1 flex flex-col min-h-0">
          {showEmptyState ? (
            <TodoEmptyState isLoading={isLoading} hasError={!!error} />
          ) : (
            <Reorder.Group
              axis="y"
              values={todos}
              onReorder={(next: Todo[]) => void syncOrder(next)}
              className="flex-1 space-y-1 overflow-y-auto pr-1"
            >
              <AnimatePresence>
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-4 px-2 flex justify-between">
          <span className="text-[10px] text-white/20">
            {completedCount} / {todos.length} Done
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default TodoList;