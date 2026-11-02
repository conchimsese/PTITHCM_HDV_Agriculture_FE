import { z } from 'zod';
import { pageSchema } from './common';
// DTO Feed khác DTO tạo Listing. Không tự thêm giá/ảnh/status mà API không trả.
export const listingFeedItemSchema = z.object({
  listingId: z.uuid(),
  seedType: z.string(),
  plotLat: z.number(),
  plotLng: z.number(),
  distanceKm: z.number().nonnegative(),
  farmer: z.object({ farmerId: z.uuid(), fullName: z.string() }),
});
export const listingFeedPageSchema = pageSchema(listingFeedItemSchema);
export type ListingFeedItem = z.infer<typeof listingFeedItemSchema>;
export const feedParamsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().positive(),
  page: z.number().int().nonnegative(),
  size: z.number().int().min(1).max(100),
});
export type FeedParams = z.infer<typeof feedParamsSchema>;
export type ListingStatus = 'OPEN' | 'LOCKED' | 'SOLD';
export type CreateListingRequest = { plotId: string; cropSeasonId: string; expectedPrice: string };
