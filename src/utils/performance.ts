/**
 * パフォーマンス最適化のためのユーティリティ関数
 */

/**
 * デバウンス関数
 * 指定時間内に連続して呼び出された場合、最後の呼び出しのみ実行する
 * @param fn 実行する関数
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた関数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * スロットリング関数
 * 指定時間内に一度だけ関数を実行する
 * @param fn 実行する関数
 * @param limit 制限時間（ミリ秒）
 * @returns スロットリングされた関数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn.apply(this, args);
          lastRan = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastRan), 0));
    }
  };
}

/**
 * メモ化関数
 * 同じ引数で呼び出された場合、計算をスキップして前回の結果を返す
 * @param fn メモ化する関数
 * @returns メモ化された関数
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
} 