'use client';

import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Todo } from '@/types';

interface TodoComponentProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export default function TodoComponent({ todos, setTodos }: TodoComponentProps) {
  /**
   * 新しいTodoをリストに追加
   * @param todo 追加するTodo
   */
  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  /**
   * Todoの完了状態を切り替え
   * @param id 対象TodoのID
   */
  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * Todoをリストから削除
   * @param id 削除するTodoのID
   */
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  /**
   * ドラッグ＆ドロップで並び替えた新しいTodoリストを反映
   * @param reorderedTodos 並び替え後のTodoリスト
   */
  const handleReorder = (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos);
  };

  return (
    <div className="space-y-8">
      <section className="fade-in" style={{ animationDelay: '0.2s' }}>
        <TodoForm addTodo={addTodo} />
      </section>
      
      <section className="fade-in" style={{ animationDelay: '0.3s' }}>
        <TodoList 
          todos={todos} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo} 
          onReorder={handleReorder}
        />
      </section>
    </div>
  );
} 