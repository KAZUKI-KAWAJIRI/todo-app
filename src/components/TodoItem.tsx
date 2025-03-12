'use client';

import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export default function TodoItem({ todo, toggleTodo, deleteTodo }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="mr-2 h-5 w-5"
        />
        <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        削除
      </button>
    </li>
  );
} 