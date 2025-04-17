'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types';
import TodoItem from './TodoItem';

interface SortableItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export default function SortableItem({ todo, toggleTodo, deleteTodo }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative' as const,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 opacity-50 group-hover:opacity-100 transition-opacity"
        {...attributes} 
        {...listeners}
      >
        <div className="w-5 h-8 flex flex-col justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="pl-8">
        <TodoItem 
          todo={todo} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
        />
      </div>
    </div>
  );
} 