import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppConfigs, updateAppConfig } from '../services/adminService';

export const useConfig = () => {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: getAppConfigs,
  });
};

export const useUpdateConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: any }) => updateAppConfig(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-config'] });
    },
  });
};
