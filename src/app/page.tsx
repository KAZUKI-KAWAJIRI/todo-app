'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('TODOの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // TODOが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <main className="container mx-auto max-w-md p-4">
      <h1 className="text-2xl font-bold text-center mb-6">TODOアプリ</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </main>
  );
}
