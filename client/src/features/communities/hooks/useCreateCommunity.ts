import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunity, type Community } from "../services/communities.api";
import { communitiesKeys } from "./useCommunities";

interface CreateCommunityInput {
  name: string;
  address: string;
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation<Community, Error, CreateCommunityInput>({
    mutationFn: createCommunity,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communitiesKeys.all,
      });
    },
  });
}
