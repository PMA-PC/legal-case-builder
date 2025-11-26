import React from 'react';
import { TodoItem } from '../types';
import { getEmoji } from '../utils/emoji';

interface TodoItemCardProps {
  todo: TodoItem;
  onToggleComplete: (id: number) => void;
}

const TodoItemCard: React.FC<TodoItemCardProps> = ({ todo, onToggleComplete }) => {
  const displayDueDate = todo.dueBy ? new Date(todo.dueBy).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-bg-card rounded-xl mb-3 cursor-pointer transition-all duration-300 hover:translate-x-1 border border-border-light shadow-card-light ${todo.isCompleted ? 'opacity-70 border-sage-500' : 'hover:border-primary-brand'}`}
      onClick={() => onToggleComplete(todo.id)}
      role="checkbox"
      aria-checked={todo.isCompleted}
      tabIndex={0}
    >
      <div className={`w-7 h-7 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 
        ${todo.isCompleted ? 'bg-sage-500 border-sage-500' : 'bg-charcoal-700 border-charcoal-600'}`}>
        {todo.isCompleted && <span className="text-white text-lg">{getEmoji('Complete')}</span>}
      </div>
      <div className="flex-1">
        <div className={`font-semibold mb-1 text-text-primary ${todo.isCompleted ? 'line-through text-text-secondary' : ''}`}>
          {getEmoji('Todo')} {todo.text}
        </div>
        {displayDueDate && (
          <div className={`text-xs ${todo.isCompleted ? 'text-text-secondary' : 'text-text-primary'}`}>
            Due: {displayDueDate}
          </div>
        )}
        {todo.isCompleted && todo.completedAt && (
          <div className="text-xs text-sage-400">
            Completed: {new Date(todo.completedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItemCard;