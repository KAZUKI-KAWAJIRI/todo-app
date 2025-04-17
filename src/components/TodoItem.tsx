'use client';

import { useState } from 'react';
import { Todo, PRIORITY_COLORS } from '@/types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export default function TodoItem({ todo, toggleTodo, deleteTodo }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 締切日が設定されている場合、現在との日時差を計算
  const getDueStatus = () => {
    if (!todo.dueDate) return null;
    
    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMs < 0) {
      return { text: '期限切れ', className: 'text-red-600 dark:text-red-400 font-bold' };
    } else if (diffDays <= 1) {
      return { text: '今日期限', className: 'text-orange-600 dark:text-orange-400 font-bold' };
    } else if (diffDays <= 3) {
      return { text: 'もうすぐ期限', className: 'text-yellow-600 dark:text-yellow-400' };
    }
    return null;
  };

  const dueStatus = getDueStatus();
  const formattedDueDate = todo.dueDate 
    ? new Date(todo.dueDate).toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : null;

  return (
    <li className={`transition-all duration-200 ${
      dueStatus?.text === '期限切れ' ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
    }`}>
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-start flex-grow">
          <div className="flex items-center h-6 mt-0.5">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="ml-3 flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                {todo.text}
              </span>
              
              {todo.priority && (
                <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[todo.priority]}`}>
                  {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                </span>
              )}
              
              {dueStatus && (
                <span className={`text-xs px-2 py-1 rounded-full ${dueStatus.className} bg-opacity-10`}>
                  {dueStatus.text}
                </span>
              )}
            </div>
            
            {formattedDueDate && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formattedDueDate}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-auto mt-2 sm:mt-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
            title={isExpanded ? "詳細を隠す" : "詳細を表示"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={() => deleteTodo(todo.id)}
            className="p-1 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none transition-colors"
            title="タスクを削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && todo.notes && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 animate-fadeIn">
          <div className="ml-8 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {todo.notes}
          </div>
        </div>
      )}
    </li>
  );
} 