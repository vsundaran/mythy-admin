import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '../services/adminService';

export const useLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};
