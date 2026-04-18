import { useInfiniteQuery } from '@tanstack/react-query';
import { getAppUsers } from '../services/adminService';
import type { GetUsersParams } from '../services/adminService';

export const useUsers = (filters: Omit<GetUsersParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['users', filters],
    queryFn: ({ pageParam = 1 }) => 
      getAppUsers({ ...filters, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasMore) {
        return lastPage.data.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
