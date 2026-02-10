import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, RefreshCcw } from "lucide-react";
import { useTodoStore } from "../store/TodoStore";

const Todo = () => {
  const { todos, fetchTodos, addTodo, deleteTodo, updateTodo } = useTodoStore();
  const [input, setInput] = useState("");
  const [checkedTodos, setCheckedTodos] = useState({});


const handleCheck = (id) => {
  setCheckedTodos((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};



  useEffect(() => {
    fetchTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-linear-to-r from-white to-blue-300 p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#0F172A]">
          My Todo List
        </h1>

        {/* Input */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded-2xl shadow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Add a new task..."
            className="flex-1 border border-gray-400 rounded-xl px-4 py-2 outline-none"
          />

          <button
            onClick={handleAdd}
            className="bg-[#4080e7] text-white px-6 py-2 rounded-xl hover:opacity-90 cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-4">
          {todos.map((todo) => (
            <div
  className={`flex items-center justify-between p-4 rounded-2xl shadow transition-colors
    ${checkedTodos[todo.id] ? "bg-green-200" : "bg-white"}
  `}
>

              <p className={todo.completed}>{todo.title}</p>

              <div className="flex gap-2">
                {/* Toggle completed */}
                <button
  onClick={() => handleCheck(todo.id)}
  className="bg-black text-white p-2 rounded-lg hover:bg-blue-500"
>
  <Check size={18} />
</button>


                {/* Reset */}
                <button
                  onClick={() => updateTodo(todo.id, { completed: false })}
                  className="bg-black text-white p-2 rounded-lg hover:bg-amber-500"
                >
                  <RefreshCcw size={18} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-black text-white p-2 rounded-lg hover:bg-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
