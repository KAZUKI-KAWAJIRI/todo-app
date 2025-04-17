'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/types';

/**
 * テーマ管理用カスタムフック
 * ローカルストレージとシステム設定からテーマを管理
 */
function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');

  // 初期テーマの設定
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // テーマ変更処理
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // ドキュメントにテーマ適用
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    isDark 
      ? root.classList.add('dark') 
      : root.classList.remove('dark');
  };

  return { theme, changeTheme };
}

/**
 * テーマ切り替えボタンコンポーネント
 */
export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();

  // テーマボタン用クラス生成
  const getButtonClass = (buttonTheme: Theme) => {
    const isActive = theme === buttonTheme;
    
    return `flex-1 py-2 px-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
      isActive 
        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-400' 
        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-600'
    }`;
  };

  return (
    <div className="transition-all duration-300">
      <div className="flex gap-2">
        <button 
          onClick={() => changeTheme('light')}
          className={getButtonClass('light')}
          aria-label="ライトモード"
        >
          <span className="text-lg" role="img" aria-label="太陽">🌞</span>
          <span className="text-xs font-medium">ライト</span>
        </button>
        
        <button 
          onClick={() => changeTheme('dark')}
          className={getButtonClass('dark')}
          aria-label="ダークモード"
        >
          <span className="text-lg" role="img" aria-label="月">🌙</span>
          <span className="text-xs font-medium">ダーク</span>
        </button>
        
        <button 
          onClick={() => changeTheme('system')}
          className={getButtonClass('system')}
          aria-label="システム設定に合わせる"
        >
          <span className="text-lg" role="img" aria-label="コンピュータ">💻</span>
          <span className="text-xs font-medium">自動</span>
        </button>
      </div>
    </div>
  );
} 