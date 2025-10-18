import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("http://localhost:8000/api/tasks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log("Fetched tasks:", response.data);
  return response.data; // array of tasks
});

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload       // overwrite with new data
        };
      }
    },
    toggleStar: (state, action) => {
      const { id, starred } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.starred = starred;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTask, deleteTask, updateTask, toggleStar } = taskSlice.actions;
export default taskSlice.reducer;
