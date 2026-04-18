import { useQuery } from '@tanstack/react-query';
import { getChats } from '../services/adminService';

export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: getChats,
  });
};
