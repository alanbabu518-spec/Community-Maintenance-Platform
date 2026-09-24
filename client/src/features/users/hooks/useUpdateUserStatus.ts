import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../services/apiClient";
import { usersKeys } from "../users.keys";

interface UpdateUserStatusInput {
  userId: number;
  isActive: boolean;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isActive }: UpdateUserStatusInput) => {
      return apiClient(`/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}
