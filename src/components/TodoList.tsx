'use client';

import { Todo } from '@/types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-500">タスクがありません。新しいタスクを追加してください。</p>;
  }

  return (
    <ul className="bg-white rounded shadow">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </ul>
  );
} 