'use client';

import { useState, useEffect } from 'react';
import Todo from '@/components/Todo';
import Sidebar from '@/components/Sidebar';
import { Todo as TodoType } from '@/types';

/**
 * TodoデータをローカルストレージとStateで管理するカスタムフック
 * @returns {[TodoType[], function]} TodosのStateとセッター関数
 */
function useTodoStorage() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  // 初回ロード時にローカルストレージからデータを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          ...(todo.dueDate && { dueDate: new Date(todo.dueDate) })
        })));
      } catch (error) {
        console.error('TODOの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // todosが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return [todos, setTodos] as const;
}

/**
 * アプリケーションヘッダー
 */
function AppHeader() {
  return (
    <header className="text-center mb-6 fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
        TODOアプリ
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        タスクを効率的に管理し、期限や優先度を設定して生産性を向上させましょう。
      </p>
    </header>
  );
}

/**
 * メインコンテンツ
 */
export default function Home() {
  const [todos, setTodos] = useTodoStorage();

  /**
   * インポートされたTODOデータの処理
   * @param importedTodos インポートされたTodoデータ
   */
  const handleImport = (importedTodos: TodoType[]) => {
    if (window.confirm('現在のタスクを全て置き換えますか？キャンセルを選択すると、インポートしたタスクが追加されます。')) {
      setTodos(importedTodos);
    } else {
      // 既存のタスクとマージ（IDが重複する場合はインポートしたタスクで上書き）
      const existingIds = new Set(todos.map(todo => todo.id));
      const newTodos = [...todos];
      
      for (const importedTodo of importedTodos) {
        if (existingIds.has(importedTodo.id)) {
          const index = newTodos.findIndex(todo => todo.id === importedTodo.id);
          newTodos[index] = importedTodo;
        } else {
          newTodos.push(importedTodo);
        }
      }
      
      setTodos(newTodos);
    }
  };

  return (
    <main className="min-h-screen py-4 px-4 sm:px-6">
      <AppHeader />
      
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* サイドバー */}
        <aside className="md:w-1/4 mb-6 md:mb-0 fade-in" style={{ animationDelay: '0.1s' }}>
          <Sidebar todos={todos} onImport={handleImport} />
        </aside>
        
        {/* メインコンテンツ */}
        <div className="md:w-3/4 fade-in" style={{ animationDelay: '0.2s' }}>
          <Todo todos={todos} setTodos={setTodos} />
        </div>
      </div>
    </main>
  );
}
