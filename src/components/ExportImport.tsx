'use client';

import React, { useState, useRef } from 'react';
import { Todo } from '@/types';

interface ExportImportProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
}

export default function ExportImport({ todos, onImport }: ExportImportProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JSONファイルでエクスポート
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `todo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // CSVファイルでエクスポート
  const handleExportCSV = () => {
    // CSVヘッダー
    const headers = ['id', 'text', 'completed', 'createdAt', 'dueDate', 'priority', 'notes'];
    
    // データを CSV 形式に変換
    const csvData = todos.map(todo => {
      return [
        todo.id,
        `"${todo.text.replace(/"/g, '""')}"`, // テキスト内の引用符をエスケープ
        todo.completed ? 'true' : 'false',
        todo.createdAt.toISOString(),
        todo.dueDate ? todo.dueDate.toISOString() : '',
        todo.priority || '',
        todo.notes ? `"${todo.notes.replace(/"/g, '""')}"` : ''
      ].join(',');
    });
    
    // ヘッダーとデータを結合
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    // データURI作成
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    
    // ダウンロードリンク作成
    const exportFileDefaultName = `todo-backup-${new Date().toISOString().slice(0, 10)}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // ファイル選択ダイアログを開く
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // JSONファイルからインポート
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          // JSONの場合
          const parsedData = JSON.parse(content);
          
          if (!Array.isArray(parsedData)) {
            throw new Error('インポートしたJSONファイルが配列形式ではありません');
          }
          
          // 日付文字列をDateオブジェクトに変換
          const convertedTodos = parsedData.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            ...(todo.dueDate && { dueDate: new Date(todo.dueDate) })
          }));
          
          onImport(convertedTodos);
        } else if (file.name.endsWith('.csv')) {
          // CSVの場合
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          // ヘッダーの検証
          const requiredFields = ['id', 'text', 'completed', 'createdAt'];
          for (const field of requiredFields) {
            if (!headers.includes(field)) {
              throw new Error(`CSVファイルに必須フィールド '${field}' がありません`);
            }
          }
          
          const convertedTodos: Todo[] = [];
          
          // 2行目以降がデータ
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // 空行をスキップ
            
            const values = parseCSVLine(lines[i]);
            const todo: any = {};
            
            // 各カラムの値を適切なフィールドに設定
            headers.forEach((header, index) => {
              if (header === 'completed') {
                todo[header] = values[index].toLowerCase() === 'true';
              } else if (header === 'createdAt' || header === 'dueDate') {
                if (values[index]) {
                  todo[header] = new Date(values[index]);
                }
              } else {
                todo[header] = values[index];
              }
            });
            
            // 必須フィールドのチェック
            if (!todo.id || !todo.text || todo.completed === undefined || !todo.createdAt) {
              continue; // 不完全な行はスキップ
            }
            
            convertedTodos.push(todo as Todo);
          }
          
          onImport(convertedTodos);
        } else {
          throw new Error('サポートされていないファイル形式です。JSONまたはCSVファイルをアップロードしてください。');
        }
        
        // 入力フィールドをリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      }
    };
    
    fileReader.onerror = () => {
      setImportError('ファイルの読み込み中にエラーが発生しました');
    };
    
    fileReader.readAsText(file);
  };
  
  // CSVの行を解析する関数（引用符で囲まれた部分を適切に処理）
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          // 連続した引用符は単一の引用符として処理
          currentValue += '"';
          i++; // 次の文字をスキップ
        } else {
          // 引用符の開始または終了
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // フィールドの区切り
        result.push(currentValue);
        currentValue = '';
      } else {
        // 通常の文字
        currentValue += char;
      }
    }
    
    // 最後のフィールドを追加
    result.push(currentValue);
    
    return result;
  };

  return (
    <div className="transition-all duration-300">
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleExportJSON}
          className="w-full py-2 px-3 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 flex items-center justify-center gap-1 text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          JSONエクスポート
        </button>
        
        <button 
          onClick={handleExportCSV}
          className="w-full py-2 px-3 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 flex items-center justify-center gap-1 text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          CSVエクスポート
        </button>
        
        <button 
          onClick={handleImportClick}
          className="w-full py-2 px-3 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60 flex items-center justify-center gap-1 text-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180 10 10)" />
          </svg>
          データをインポート
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.csv" 
          className="hidden"
        />
      </div>
      
      {importError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{importError}</span>
          </div>
        </div>
      )}
    </div>
  );
} 