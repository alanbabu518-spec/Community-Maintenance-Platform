export function maintenanceListCacheKey(
  role: string,
  userId: number,
  page: number,
  limit: number,
  filters: object,
) {
  const normalizedFilters = Object.keys(filters)
    .sort()
    .reduce<Record<string, unknown>>((result, key) => {
      result[key] = (filters as Record<string, unknown>)[key];
      return result;
    }, {});

  return `maintenance:list:${role}:${userId}:${page}:${limit}:${JSON.stringify(normalizedFilters)}`;
}
