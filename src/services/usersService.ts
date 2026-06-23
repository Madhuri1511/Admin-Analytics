import { api } from './api';
import type { UserListResponse, User, UsersQuery } from '../store/usersSlice';

export const usersService = {
  async getUsers(params: Partial<UsersQuery>): Promise<UserListResponse> {
    const { data } = await api.get<UserListResponse>('/users', { params });
    return data;
  },

  async createUser(payload: any): Promise<User> {
    const { data } = await api.post<User>('/users', payload);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async updateUser(id: string, payload: any): Promise<User> {
    const { data } = await api.put<User>(`/users/${id}`, payload);
    return data;
  },
};
