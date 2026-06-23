import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../services/analyticsService';

export interface AnalyticsData {
  totalUsers: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

export interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getSummary();
    } catch {
      return rejectWithValue('Failed to load analytics');
    }
  },
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load analytics';
      });
  },
});

export default analyticsSlice.reducer;
