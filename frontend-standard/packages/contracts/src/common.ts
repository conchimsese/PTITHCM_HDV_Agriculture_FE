import { z } from 'zod';
export const apiErrorSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number(),
  code: z.string(),
  message: z.string(),
  path: z.string().optional(),
  traceId: z.string().optional(),
});
export const decimalMoneySchema = z.string().regex(/^\d+\.\d{2}$/, 'Tiền phải là decimal string');
export const pageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
export type Page<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export type CursorPage<T> = { items: T[]; nextCursor: string | null; hasMore: boolean };
// Xác minh tên field cursor theo OpenAPI từng endpoint trước khi sử dụng.
