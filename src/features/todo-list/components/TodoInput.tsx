import { HiPlus } from 'react-icons/hi2';

interface TodoInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TodoInput = ({ value, onChange, onSubmit }: TodoInputProps) => (
  <form onSubmit={onSubmit} className="flex gap-2 mb-6 shrink-0">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#1DB954]/50 transition-all text-sm text-white placeholder:text-white/20"
      placeholder="Add a new task..."
    />
    <button
      type="submit"
      className="p-2.5 bg-[#1DB954] text-black rounded-xl"
    >
      <HiPlus size={20} />
    </button>
  </form>
);

export default TodoInput;