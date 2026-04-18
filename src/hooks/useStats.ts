import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/adminService';

export const useStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
};
