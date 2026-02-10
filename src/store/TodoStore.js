import { create } from "zustand";

const API_URL = "https://netg9hbpee.execute-api.us-east-2.amazonaws.com/default/firstFunction";

export const useTodoStore = create((set, get) => ({

  todos: [],
  loading: false,

  // 📌 GET TODOS
  fetchTodos: async () => {
    set({ loading: true });

    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      set({ todos: data.data || [] });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      set({ todos: [...get().todos, data.data] });

    } catch (error) {
      console.error("Error creating todo", error);
    }
  },

  // 📌 UPDATE TODO
 updateTodo: async (id, updates) => {
  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...updates }),
    });

    // 🚨 Si el backend falla, NO seguimos
    if (!res.ok) {
      const errorText = await res.text();
      console.error("PUT failed:", res.status, errorText);
      return;
    }

    const json = await res.json();

    if (!json?.data?.id) {
      console.error("Invalid PUT response:", json);
      return;
    }

    const updatedTodo = json.data;

    set((state) => ({
      todos: state.todos.map((todo) =>
        todo?.id === updatedTodo.id ? updatedTodo : todo
      ),
    }));

  } catch (error) {
    console.error("Error updating todo", error);
  }
},



  // 📌 DELETE TODO
  deleteTodo: async (id) => {
    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      const filtered = get().todos.filter(todo => todo.id !== id);

      set({ todos: filtered });

    } catch (error) {
      console.error("Error deleting todo", error);
    }
  },

}));
