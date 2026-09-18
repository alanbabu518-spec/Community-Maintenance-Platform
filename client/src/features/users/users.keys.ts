export const usersKeys = {
  all: ["users"] as const,
  list: (filters: unknown) =>
    [...usersKeys.all, "list", filters] as const,
};