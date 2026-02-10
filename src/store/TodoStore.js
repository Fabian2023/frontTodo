import { create } from "zustand";

const API_URL =
  "https://netg9hbpee.execute-api.us-east-2.amazonaws.com/default/firstFunction";

export const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,

  // 📌 GET TODOS
  fetchTodos: async () => {
    set({ loading: true });

    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const normalizedTodos = (data.data || []).map((todo) => ({
        ...todo,
        title:
          typeof todo.title === "object"
            ? todo.title.title
            : todo.title,
        createdAt:
          typeof todo.createdAt === "object"
            ? todo.createdAt.createdAt
            : todo.createdAt,
      }));

      set({ todos: normalizedTodos });
    } catch (error) {
      console.error("Error fetching todos", error);
    }

    set({ loading: false });
  },

  // 📌 CREATE TODO
  addTodo: async (title) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const json = await res.json();
      const newTodo = json.data;

      newTodo.title =
        typeof newTodo.title === "object"
          ? newTodo.title.title
          : newTodo.title;

      newTodo.createdAt =
        typeof newTodo.createdAt === "object"
          ? newTodo.createdAt.createdAt
          : newTodo.createdAt;

      set({ todos: [...get().todos, newTodo] });
    } catch (error) {
      console.error("Error creating todo", error);
    }
  },

  // 📌 UPDATE TODO
  updateTodo: async (id, updates) => {
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!res.ok) return;

      const json = await res.json();
      const updatedTodo = json.data;

      updatedTodo.title =
        typeof updatedTodo.title === "object"
          ? updatedTodo.title.title
          : updatedTodo.title;

      updatedTodo.createdAt =
        typeof updatedTodo.createdAt === "object"
          ? updatedTodo.createdAt.createdAt
          : updatedTodo.createdAt;

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("Error updating todo", error);
    }
  },

  // 📌 DELETE TODO
  deleteTodo: async (id) => {
    try {
      await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });

      set({
        todos: get().todos.filter((todo) => todo.id !== id),
      });
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  },
}));
