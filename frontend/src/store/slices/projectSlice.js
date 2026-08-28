import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await projectService.getProjects();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch projects');
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { dispatch, rejectWithValue }) => {
  try {
    await projectService.create(data);
    dispatch(fetchProjects());
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create project');
  }
});

export const archiveProject = createAsyncThunk('projects/archive', async (id, { dispatch, rejectWithValue }) => {
  try {
    await projectService.archiveProject(id);
    dispatch(fetchProjects());
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to archive project. The project may already be archived or you may not have permission.');
  }
});

export const selectProjectsLoadingStatus = (state) => {
  if (state.projects.loading) return 'loading';
  if (state.projects.error) return 'failed';
  if (state.projects.items.length >= 0) return 'succeeded';
  return 'idle';
};

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.items = action.payload;
    },
    updateProjectStatus: (state, action) => {
      const item = state.items.find((p) => p.id === action.payload.id);
      if (item) item.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProjects, updateProjectStatus } = projectSlice.actions;
export default projectSlice.reducer;
