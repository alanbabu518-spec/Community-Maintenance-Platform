import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStaff } from "../services/users.api";
import { usersKeys } from "../users.keys";
import type { CreateStaffInput } from "../types/user.types";

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffInput) => createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}