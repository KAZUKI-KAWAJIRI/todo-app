'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '@/types';

interface TodoFormProps {
  addTodo: (todo: Todo) => void;
}

export default function TodoForm({ addTodo }: TodoFormProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') return;
    
    const newTodo: Todo = {
      id: uuidv4(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(priority && { priority: priority as 'low' | 'medium' | 'high' }),
      ...(notes.trim() && { notes: notes.trim() }),
    };
    
    addTodo(newTodo);
    resetForm();
  };

  const resetForm = () => {
    setText('');
    setDueDate('');
    setPriority('');
    setNotes('');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        新しいタスクを追加
      </h2>

      <div className="flex items-center mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-grow p-3 border dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base"
        />
        <button
          type="submit"
          className="btn btn-primary rounded-l-none rounded-r-lg"
        >
          追加
        </button>
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 mr-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {isExpanded ? '詳細を隠す' : '詳細を表示'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                締切日時
              </label>
              <input
                type="datetime-local"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                優先度
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                className="w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
              >
                <option value="">選択してください</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              詳細メモ
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="タスクの詳細を入力..."
              className="w-full p-3 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] dark:bg-gray-700 dark:text-white resize-y"
            />
          </div>
        </div>
      )}
    </form>
  );
} 