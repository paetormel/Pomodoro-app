interface TodoEmptyStateProps {
    isLoading: boolean;
    hasError: boolean;
  }
  
  const TodoEmptyState = ({ isLoading, hasError }: TodoEmptyStateProps) => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[12px] text-white/20">Loading tasks...</p>
        </div>
      );
    }
  
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[12px] text-white/10">
          {hasError ? 'Could not load tasks.' : 'Your playlist is empty.'}
        </p>
      </div>
    );
  };
  
  export default TodoEmptyState;