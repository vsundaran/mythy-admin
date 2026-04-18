import api from './api';

// --- Types ---

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

export interface StatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalChats: number;
    premiumUsers: number;
    totalRevenue: number;
    chartData: any[];
  };
}

export interface ChatsResponse {
  success: boolean;
  message: string;
  data: {
    chats: any[];
    totalCount: number;
  };
}

export interface ConfigResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: any;
  };
}

// --- API Calls ---

export const adminLogin = async (data: any): Promise<LoginResponse> => {
  const response = await api.post('/admin/login', data);
  return response.data;
};

export const getAppUsers = async (params: GetUsersParams): Promise<UserResponse> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getDashboardStats = async (): Promise<StatsResponse> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getChats = async (): Promise<ChatsResponse> => {
  const response = await api.get('/admin/chats');
  return response.data;
};

export const getAppConfigs = async (): Promise<ConfigResponse> => {
  const response = await api.get('/admin/configs');
  return response.data;
};

export const updateAppConfig = async (key: string, data: any): Promise<ConfigResponse> => {
  const response = await api.put(`/admin/configs/${key}`, data);
  return response.data;
};
