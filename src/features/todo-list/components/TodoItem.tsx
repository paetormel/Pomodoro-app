import { MdDragIndicator } from 'react-icons/md';
import {
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
  RiDeleteBin6Line,
} from 'react-icons/ri';
import { Reorder } from 'framer-motion';
import type { Todo } from '@/src/app/generated/prisma/client';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
  <Reorder.Item value={todo}>
    <div className="flex items-center gap-3 p-3 rounded-xl group cursor-default">
      <MdDragIndicator size={18} className="text-white/20 cursor-grab" />

      <button
        onClick={() => onToggle(todo.id)}
        className="text-white/40 hover:text-[#1DB954] transition-colors"
      >
        {todo.isCompleted ? (
          <RiCheckboxCircleFill size={22} className="text-[#1DB954]" />
        ) : (
          <RiCheckboxBlankCircleLine size={22} />
        )}
      </button>

      <span
        className={`flex-1 text-sm transition-all ${
          todo.isCompleted ? 'line-through text-white/30' : 'text-white/80'
        }`}
      >
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <RiDeleteBin6Line size={18} />
      </button>
    </div>
  </Reorder.Item>
);

export default TodoItem;