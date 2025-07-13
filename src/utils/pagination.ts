import { Document, Query } from 'mongoose';

export interface IPaginationOptions {
  page: number;
  limit: number;
}

export const paginate = <T extends Document>(
  query: Query<T[], T>,
  { page, limit }: IPaginationOptions
) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
