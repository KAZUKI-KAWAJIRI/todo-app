'use client';

import { useState } from 'react';
import { Todo, SortOption, FilterOption } from '@/types';
import TodoItem from './TodoItem';
import SortableItem from './SortableItem';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  onReorder: (todos: Todo[]) => void;
}

export default function TodoList({ todos, toggleTodo, deleteTodo, onReorder }: TodoListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDndEnabled, setIsDndEnabled] = useState(false);

  // ドラッグ＆ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over.id);
      
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      onReorder(newTodos);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">タスクがありません</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">新しいタスクを追加してください</p>
        </div>
      </div>
    );
  }

  // フィルタリングと検索の適用
  let filteredTodos = [...todos];
  
  // 検索フィルタリング
  if (searchTerm.trim() !== '') {
    filteredTodos = filteredTodos.filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // 完了状態フィルタリング
  if (filterBy === 'active') {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  } else if (filterBy === 'completed') {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  // ソートする（ドラッグ＆ドロップモードでない場合のみ）
  const sortedTodos = isDndEnabled ? filteredTodos : [...filteredTodos].sort((a, b) => {
    // まず完了済みのタスクを後ろに
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (sortBy === 'priority') {
      // 優先度でソート（高→中→低→未設定）
      const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
      const aPriority = a.priority || 'undefined';
      const bPriority = b.priority || 'undefined';
      
      if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      }
    } else if (sortBy === 'dueDate') {
      // 期限日でソート（期限あり→期限なし、近い順）
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // 期限ありを先に
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
    }

    // デフォルトは作成日の新しい順
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 検索とフィルターの結果がないかチェック
  if (sortedTodos.length === 0) {
    return (
      <div className="card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            タスク検索＆フィルター
          </h2>
          {/* 検索ボックス */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="タスクを検索..."
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* フィルターとソートのコントロール */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">表示: </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
              >
                <option value="all">すべて</option>
                <option value="active">未完了</option>
                <option value="completed">完了済み</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">並び替え: </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
              >
                <option value="default">作成日（新しい順）</option>
                <option value="priority">優先度（高→低）</option>
                <option value="dueDate">締切日（近い順）</option>
              </select>
            </div>
            
            {/* ドラッグ＆ドロップ切り替え */}
            <div className="flex flex-col">
              <label htmlFor="dndToggle" className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                ドラッグ＆ドロップ:
              </label>
              <div className="flex items-center h-10">
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    id="dndToggle"
                    type="checkbox"
                    checked={isDndEnabled}
                    onChange={() => setIsDndEnabled(!isDndEnabled)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="dndToggle"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      isDndEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  ></label>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isDndEnabled ? 'オン' : 'オフ'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-700 dark:text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            条件に一致するタスクがありません
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          タスク検索＆フィルター
        </h2>
        
        {/* 検索ボックス */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="タスクを検索..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* フィルターとソートのコントロール */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">表示: </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="all">すべて</option>
              <option value="active">未完了</option>
              <option value="completed">完了済み</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">並び替え: </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              disabled={isDndEnabled}
              className={`w-full p-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right pr-8 ${isDndEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="default">作成日（新しい順）</option>
              <option value="priority">優先度（高→低）</option>
              <option value="dueDate">締切日（近い順）</option>
            </select>
          </div>
          
          {/* ドラッグ＆ドロップ切り替え */}
          <div className="flex flex-col">
            <label htmlFor="dndToggle" className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              ドラッグ＆ドロップ:
            </label>
            <div className="flex items-center h-10">
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  id="dndToggle"
                  type="checkbox"
                  checked={isDndEnabled}
                  onChange={() => setIsDndEnabled(!isDndEnabled)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="dndToggle"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    isDndEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></label>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isDndEnabled ? 'オン' : 'オフ'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">タスク一覧</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {sortedTodos.length} 件のタスク
            </div>
          </div>
        </div>
        
        {isDndEnabled ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTodos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {sortedTodos.map((todo) => (
                  <SortableItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 