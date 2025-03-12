'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '@/types';

interface TodoFormProps {
  addTodo: (todo: Todo) => void;
}

export default function TodoForm({ addTodo }: TodoFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') return;
    
    const newTodo: Todo = {
      id: uuidv4(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    addTodo(newTodo);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </div>
    </form>
  );
} 