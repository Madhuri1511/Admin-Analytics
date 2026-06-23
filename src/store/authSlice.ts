import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../services/authService';
import { setAuthHeader } from '../services/api';
import { tokenStorage } from '../utils/tokenStorage';
import { updateUser } from './usersSlice';

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      setAuthHeader(response.accessToken);
      return response.user as User;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? 'Login failed';
      return rejectWithValue(message);
    }
  },
);

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const token = tokenStorage.getAccessToken();
  if (!token) return null;

  setAuthHeader(token);
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = { id: payload.sub, email: payload.email, name: payload.name, profileImage: payload.profileImage } as User;

    // Try to sync with local mock DB if available (since the JWT might be stale)
    try {
      const stored = localStorage.getItem('app_users_store');
      if (stored) {
        const users = JSON.parse(stored);
        const latest = users.find((u: any) => u.id === user.id || u.email === user.email);
        if (latest) {
          user.name = latest.name;
          if (latest.profileImage) {
            user.profileImage = latest.profileImage;
          } else {
             delete user.profileImage;
          }
        }
      }
    } catch (e) {
      // Ignore
    }

    return user;
  } catch {
    tokenStorage.clearTokens();
    setAuthHeader(null);
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      tokenStorage.clearTokens();
      setAuthHeader(null);
    },
    clearError(state) {
      state.error = null;
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
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) {
          state.user = {
            ...state.user,
            name: action.payload.name,
            profileImage: action.payload.profileImage,
          };
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
