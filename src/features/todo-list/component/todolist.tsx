"use client";
import React, { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { HiPlus } from "react-icons/hi2";
import { RiDeleteBin6Line, RiCheckboxCircleFill, RiCheckboxBlankCircleLine, RiListCheck2 } from "react-icons/ri";
import { MdDragIndicator } from "react-icons/md";

// 1. Types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}
interface TodolistProps {
    constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const TodoList = ({ constraintsRef }: TodolistProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  // 2. Logic Handlers
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Draggable Wrapper - Spotify Dark Style */}
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        className="pointer-events-auto absolute p-5 rounded-4xl border border-white/20 bg-[#282828]/90  backdrop-blur-2xl shadow-2xl w-95"
        style={{ top: "5%", right: "2%" }}
      >
        {/* Header - Media Icon Style */}
        <div className="flex justify-between items-center mb-5 px-2">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiListCheck2 size={24} />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">Daily Tasks</span>
          </div>
          <div className="w-8 h-1 bg-white/10 rounded-full cursor-grab active:cursor-grabbing"></div>
        </div>

        {/* Input Form - Dark Sleek Style */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#1DB954]/50 transition-all text-sm text-white placeholder:text-white/20"
          />
          <button 
            type="submit"
            className="p-2.5 bg-[#1DB954] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#1DB954]/20"
          >
            <HiPlus size={20} />
          </button>
        </form>

        {/* Reorderable List - Playlist Style */}
        <div className="bg-[#181818] rounded-2xl p-2 border border-white/5 shadow-inner">
          <Reorder.Group 
            axis="y" 
            values={todos} 
            onReorder={setTodos} 
            className="space-y-1 max-h-75 overflow-y-auto pr-1 scrollbar-hide"
          >
            <AnimatePresence mode="popLayout">
              {todos.map((todo) => (
                <Reorder.Item
                  key={todo.id}
                  value={todo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing transition-colors group ${
                    todo.completed ? "bg-transparent" : "hover:bg-white/5"
                  }`}
                >
                  <MdDragIndicator className="text-white/10 group-hover:text-white/30 transition-colors" size={18} />
                  
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className="transition-transform active:scale-90"
                  >
                    {todo.completed ? 
                      <RiCheckboxCircleFill size={22} className="text-[#1DB954]" /> : 
                      <RiCheckboxBlankCircleLine size={22} className="text-white/20 hover:text-white/40" />
                    }
                  </button>

                  <span className={`flex-1 text-sm font-medium transition-all ${
                    todo.completed ? "text-white/20 line-through" : "text-white/80"
                  }`}>
                    {todo.text}
                  </span>

                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-1"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
          
          {todos.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-[12px] text-white/10 italic">Your playlist is empty.</p>
            </div>
          )}
        </div>

        {/* Footer Statistics */}
        <div className="mt-4 px-2 flex justify-between items-center">
          <span className="text-[10px] text-white/20 font-medium uppercase tracking-wider">
            {todos.filter(t => t.completed).length} / {todos.length} Done
          </span>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-[#1DB954]"></div>
             <div className="w-1 h-1 rounded-full bg-white/10"></div>
             <div className="w-1 h-1 rounded-full bg-white/10"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TodoList;