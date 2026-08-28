import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk('tasks/fetchByProject', async (projectId, { rejectWithValue }) => {
  try {
    const response = await taskService.getByProject(projectId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch tasks');
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ taskId, status }, { getState, rejectWithValue }) => {
  try {
    const response = await taskService.updateTaskStatus(taskId, status);
    return response.data;
  } catch (error) {
    return rejectWithValue({ taskId, error: error.message || 'Failed to update status' });
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchQuery: '',
    updatingTaskIds: [],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskStatus.pending, (state, action) => {
        state.updatingTaskIds.push(action.meta.arg.taskId);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updatingTaskIds = state.updatingTaskIds.filter((id) => id !== action.payload.id);
        const item = state.items.find((t) => t.id === action.payload.id);
        if (item) item.status = action.payload.status;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updatingTaskIds = state.updatingTaskIds.filter((id) => id !== action.payload?.taskId);
        state.error = action.payload?.error;
      });
  },
});

export const { setSearchQuery } = taskSlice.actions;
export default taskSlice.reducer;
