import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersService } from '../services/usersService';
import type { RootState } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage?: string;
  createdAt: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UsersQuery {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  role: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface UsersState {
  list: UserListResponse | null;
  loading: boolean;
  error: string | null;
  query: UsersQuery;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  visibleColumns: string[];
}

const defaultQuery: UsersQuery = {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
  role: '',
  status: '',
};

const initialState: UsersState = {
  list: null,
  loading: false,
  error: null,
  query: defaultQuery,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  visibleColumns: ['name', 'email', 'role', 'status', 'createdAt', 'actions'],
};

export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (params: Partial<UsersQuery>, { rejectWithValue }) => {
    try {
      return await usersService.getUsers(params);
    } catch {
      return rejectWithValue('Failed to load users');
    }
  },
);

export const createUser = createAsyncThunk(
  'users/create',
  async (payload: Partial<User>, { rejectWithValue }) => {
    try {
      return await usersService.createUser(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? 'Failed to create user';
      return rejectWithValue(message);
    }
  },
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, payload }: { id: string; payload: Partial<User> }, { rejectWithValue }) => {
    try {
      return await usersService.updateUser(id, payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? 'Failed to update user';
      return rejectWithValue(message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue, getState, dispatch }) => {
    try {
      await usersService.deleteUser(id);
      const state = getState() as RootState;
      dispatch(fetchUsers(state.users.query));
      return id;
    } catch {
      return rejectWithValue('Failed to delete user');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<Partial<UsersQuery>>) {
      state.query = { ...state.query, ...action.payload };
    },
    resetQuery(state) {
      state.query = defaultQuery;
    },
    toggleColumn(state, action: PayloadAction<string>) {
      const col = action.payload;
      const idx = state.visibleColumns.indexOf(col);
      if (idx >= 0) {
        if (state.visibleColumns.length > 2) {
          state.visibleColumns.splice(idx, 1);
        }
      } else {
        state.visibleColumns.push(col);
      }
    },
    clearCreateError(state) {
      state.createError = null;
    },
    clearUpdateError(state) {
      state.updateError = null;
    },
  },
   extraReducers: (builder) => {
       builder
         // Users fetch
         .addCase(fetchUsers.pending, (state) => {
           state.loading = true;
           state.error = null;
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
           state.loading = false;
           state.list = action.payload;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
           state.loading = false;
           state.error = (action.payload as string) ?? 'Failed to load users';
         })
         // Users CRUD
         .addCase(createUser.pending, (state) => {
           state.createLoading = true;
           state.createError = null;
         })
         .addCase(createUser.fulfilled, (state) => {
           state.createLoading = false;
         })
         .addCase(createUser.rejected, (state, action) => {
           state.createLoading = false;
           state.createError = (action.payload as string) ?? 'Failed to create user';
         })
         .addCase(updateUser.pending, (state) => {
           state.updateLoading = true;
           state.updateError = null;
         })
         .addCase(updateUser.fulfilled, (state) => {
           state.updateLoading = false;
         })
         .addCase(updateUser.rejected, (state, action) => {
           state.updateLoading = false;
           state.updateError = (action.payload as string) ?? 'Failed to update user';
         });
   },
});

export const { setQuery, resetQuery, toggleColumn, clearCreateError, clearUpdateError } = usersSlice.actions;

export default usersSlice.reducer;
