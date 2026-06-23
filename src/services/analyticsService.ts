import { api } from './api';
import type { AnalyticsData } from '../store/analyticsSlice';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsData> {
    const { data } = await api.get<AnalyticsData>('/analytics/summary');
    return data;
  },
};
