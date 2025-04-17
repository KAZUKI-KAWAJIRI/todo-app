/**
 * タスクアイテムの型定義
 */
export interface Todo {
  /** タスクの一意のID */
  id: string;
  
  /** タスクのテキスト内容 */
  text: string;
  
  /** タスクの完了状態 */
  completed: boolean;
  
  /** タスクの作成日時 */
  createdAt: Date;
  
  /** タスクの締切日時（任意） */
  dueDate?: Date;
  
  /** タスクの優先度（任意） */
  priority?: Priority;
  
  /** タスクの詳細メモ（任意） */
  notes?: string;
}

/**
 * タスクの優先度
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * 優先度に応じた表示色の設定
 */
export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

/**
 * テーマの種類
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * ソート順オプション
 */
export type SortOption = 'default' | 'priority' | 'dueDate';

/**
 * フィルターオプション
 */
export type FilterOption = 'all' | 'active' | 'completed';