import { FilterQuery } from 'mongoose';

// Build a reusable filter for search and simple field filters
export const buildFilter = <T>(
  params: Record<string, any>,
  searchableFields: (keyof T)[]
): FilterQuery<T> => {
  const filter: any = {};

  if (params.search) {
    const regex = new RegExp(params.search, 'i');
    filter['$or'] = searchableFields.map(field => ({ [field]: regex }));
  }

  if (params.category) {
    filter.category = params.category;
  }

  return filter;
};
