'use client';

import ThemeToggle from './ThemeToggle';
import ExportImport from './ExportImport';
import { Todo } from '@/types';

interface SidebarProps {
  todos: Todo[];
  onImport: (importedTodos: Todo[]) => void;
}

/**
 * アプリケーションのサイドバーコンポーネント
 * テーマ設定とデータインポート/エクスポート機能を提供
 */
export default function Sidebar({ todos, onImport }: SidebarProps) {
  const currentYear = new Date().getFullYear();

  return (
    <nav className="w-full md:w-64 md:min-h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:sticky md:top-4">
      {/* ヘッダー */}
      <header className="text-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">設定</h2>
        <div className="mt-1 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
      </header>
      
      {/* 設定セクション */}
      <div className="space-y-6">
        {/* テーマ設定 */}
        <section className="fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">テーマ設定</h3>
          <ThemeToggle />
        </section>
        
        {/* データ管理 */}
        <section className="fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">データ管理</h3>
          <ExportImport todos={todos} onImport={onImport} />
        </section>
      </div>
      
      {/* フッター */}
      <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>タスク管理アプリ</p>
        <p>© {currentYear}</p>
      </footer>
    </nav>
  );
} 