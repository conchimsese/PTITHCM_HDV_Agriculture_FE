import {
  feedParamsSchema,
  listingFeedPageSchema,
  type FeedParams,
  type ListingFeedItem,
  type Page,
} from '@agri/contracts';
import type { ApiClient } from './http';
export interface TradingApi {
  getFeed: (params: FeedParams, signal?: AbortSignal) => Promise<Page<ListingFeedItem>>;
}
export const createTradingApi = (http: ApiClient): TradingApi => ({
  async getFeed(params, signal) {
    const valid = feedParamsSchema.parse(params);
    const query = Object.entries(valid)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return http.request(`/api/v1/listings/feed?${query}`, {
      signal,
      schema: listingFeedPageSchema,
    });
  },
});
