import {
  createListingRequestSchema,
  createOfferRequestSchema,
  feedParamsSchema,
  listingDtoSchema,
  listingFeedPageSchema,
  listingFilterQuerySchema,
  offerDtoSchema,
  offerFilterQuerySchema,
  pagedListingSchema,
  pagedOfferSchema,
  singleResponseSchema,
  type CreateListingRequest,
  type CreateOfferRequest,
  type FeedParams,
  type ListingDTO,
  type ListingFeedItem,
  type ListingFilterQuery,
  type OfferDTO,
  type OfferFilterQuery,
  type Page,
} from '@agri/contracts';
import type { ApiClient } from './http';

export interface TradingApi {
  // ── Listings ──
  createListing(
    payload: CreateListingRequest,
    idempotencyKey?: string,
    signal?: AbortSignal,
  ): Promise<ListingDTO>;
  getListings(params?: ListingFilterQuery, signal?: AbortSignal): Promise<Page<ListingDTO>>;
  getListingDetail(listingId: string, signal?: AbortSignal): Promise<ListingDTO>;

  // ── Offers ──
  createOffer(
    payload: CreateOfferRequest,
    idempotencyKey?: string,
    signal?: AbortSignal,
  ): Promise<OfferDTO>;
  acceptOffer(offerId: string, signal?: AbortSignal): Promise<OfferDTO>;
  getOfferDetail(offerId: string, signal?: AbortSignal): Promise<OfferDTO>;
  listOffers(params?: OfferFilterQuery, signal?: AbortSignal): Promise<Page<OfferDTO>>;

  // ── Legacy GPS Feed Compatibility ──
  getFeed(params: FeedParams, signal?: AbortSignal): Promise<Page<ListingFeedItem>>;
}

function buildQuery(params: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

export const createTradingApi = (http: ApiClient): TradingApi => ({
  async createListing(payload, idempotencyKey, signal) {
    const valid = createListingRequestSchema.parse(payload);
    return http.request('/api/v1/listings', {
      method: 'POST',
      body: valid,
      idempotencyKey,
      signal,
      schema: listingDtoSchema,
    });
  },

  async getListings(params = {}, signal) {
    const valid = listingFilterQuerySchema.parse(params);
    const query = buildQuery(valid as Record<string, unknown>);
    return http.request(`/api/v1/listings${query}`, {
      signal,
      schema: pagedListingSchema,
    });
  },

  async getListingDetail(listingId, signal) {
    if (!listingId) throw new Error('listingId là bắt buộc');
    const res = await http.request(`/api/v1/listings/${encodeURIComponent(listingId)}`, {
      signal,
      schema: singleResponseSchema(listingDtoSchema),
    });
    return res.data;
  },

  async createOffer(payload, idempotencyKey, signal) {
    const valid = createOfferRequestSchema.parse(payload);
    return http.request('/api/v1/offers', {
      method: 'POST',
      body: valid,
      idempotencyKey,
      signal,
      schema: offerDtoSchema,
    });
  },

  async acceptOffer(offerId, signal) {
    if (!offerId) throw new Error('offerId là bắt buộc');
    const res = await http.request(`/api/v1/offers/${encodeURIComponent(offerId)}/accept`, {
      method: 'POST',
      body: {},
      signal,
      schema: singleResponseSchema(offerDtoSchema),
    });
    return res.data;
  },

  async getOfferDetail(offerId, signal) {
    if (!offerId) throw new Error('offerId là bắt buộc');
    const res = await http.request(`/api/v1/offers/${encodeURIComponent(offerId)}`, {
      signal,
      schema: singleResponseSchema(offerDtoSchema),
    });
    return res.data;
  },

  async listOffers(params = {}, signal) {
    const valid = offerFilterQuerySchema.parse(params);
    const query = buildQuery(valid as Record<string, unknown>);
    return http.request(`/api/v1/offers${query}`, {
      signal,
      schema: pagedOfferSchema,
    });
  },

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
