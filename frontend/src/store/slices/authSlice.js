import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response.data;
  } catch (error) {
    // error is already normalized by api.js interceptor: { message, status, timestamp }
    return rejectWithValue({ message: error.message || 'Invalid credentials' });
  }
});

const storedUser = localStorage.getItem('user');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser ? { username: parsedUser.username, role: parsedUser.role } : null,
    token: parsedUser?.token || null,
    isAuthenticated: !!parsedUser,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const payload = action.payload;
      state.user = payload.user || { username: payload.username, role: payload.role };
      state.token = payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { username: action.payload.username, role: action.payload.role };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
