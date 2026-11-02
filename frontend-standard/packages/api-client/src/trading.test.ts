import { describe, it, expect, vi } from 'vitest';
import { listingFeedPageSchema } from '@agri/contracts';
import { createApiClient } from './http';
import { createTradingApi } from './trading';
import { mockTradingApi } from './mock';

const params = { lat: 10.125, lng: 106.45, radius: 50, page: 0, size: 2 };
describe('Listing feed contract and adapters', () => {
  it('filters by GPS, sorts by distance and paginates the mock source', async () => {
    const first = await mockTradingApi.getFeed(params);
    const second = await mockTradingApi.getFeed({ ...params, page: 1 });
    expect(listingFeedPageSchema.safeParse(first).success).toBe(true);
    expect(first.totalElements).toBe(3);
    expect(first.items).toHaveLength(2);
    expect(second.items).toHaveLength(1);
    expect(first.items[0].distanceKm).toBe(0);
    expect(second.items[0].distanceKm).toBeGreaterThan(first.items[1].distanceKm);
    expect(first.items.map((item) => item.listingId)).not.toContain(second.items[0].listingId);
  });

  it('returns a valid empty page at a far away location', async () => {
    expect(await mockTradingApi.getFeed({ ...params, lat: 0, lng: 0, radius: 1 })).toMatchObject({
      items: [],
      totalElements: 0,
      totalPages: 0,
    });
  });

  it('rejects invalid GPS/pagination before a real network request', async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const api = createTradingApi(
      createApiClient({ baseUrl: '', getAccessToken: () => undefined, fetchImpl }),
    );
    await expect(api.getFeed({ ...params, lat: 91 })).rejects.toThrow();
    await expect(api.getFeed({ ...params, size: 101 })).rejects.toThrow();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('calls the approved feed query and propagates dependency failure without mock fallback', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json(
          { status: 503, code: 'DEPENDENCY_UNAVAILABLE', message: 'Unavailable' },
          { status: 503 },
        ),
      );
    const api = createTradingApi(
      createApiClient({
        baseUrl: 'https://gateway.example.test',
        getAccessToken: () => 'token',
        fetchImpl,
      }),
    );
    await expect(api.getFeed(params)).rejects.toMatchObject({ code: 'DEPENDENCY_UNAVAILABLE' });
    expect(fetchImpl.mock.calls[0][0]).toBe(
      'https://gateway.example.test/api/v1/listings/feed?lat=10.125&lng=106.45&radius=50&page=0&size=2',
    );
  });
});
