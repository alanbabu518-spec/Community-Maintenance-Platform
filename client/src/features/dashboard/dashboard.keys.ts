export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  maintenance: () => [...dashboardKeys.all, "maintenance"] as const,
};