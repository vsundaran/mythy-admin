import api from './api';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: any[];
    totalCount: number;
    hasMore: boolean;
    page: number;
    limit: number;
  };
}

export const getAppUsers = async (params: GetUsersParams): Promise<UserResponse> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};
