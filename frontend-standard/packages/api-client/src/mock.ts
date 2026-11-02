import { feedParamsSchema, type ListingFeedItem } from '@agri/contracts';
import type { TradingApi } from './trading';
const rows: ListingFeedItem[] = [
  {
    listingId: '44444444-4444-4444-8444-444444444444',
    seedType: 'ST25',
    plotLat: 10.125,
    plotLng: 106.45,
    distanceKm: 0,
    farmer: { farmerId: '11111111-1111-4111-8111-111111111111', fullName: 'Nông dân mẫu An' },
  },
  {
    listingId: '55555555-5555-4555-8555-555555555555',
    seedType: 'OM18',
    plotLat: 10.195,
    plotLng: 106.512,
    distanceKm: 0,
    farmer: { farmerId: '66666666-6666-4666-8666-666666666666', fullName: 'Nông dân mẫu Bình' },
  },
  {
    listingId: '77777777-7777-4777-8777-777777777777',
    seedType: 'Đài Thơm 8',
    plotLat: 10.32,
    plotLng: 106.61,
    distanceKm: 0,
    farmer: { farmerId: '88888888-8888-4888-8888-888888888888', fullName: 'Nông dân mẫu Chi' },
  },
];
const radians = (n: number) => (n * Math.PI) / 180;
function distance(lat: number, lng: number, row: ListingFeedItem) {
  const a =
    Math.sin(radians(row.plotLat - lat) / 2) ** 2 +
    Math.cos(radians(lat)) *
      Math.cos(radians(row.plotLat)) *
      Math.sin(radians(row.plotLng - lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
export const mockTradingApi: TradingApi = {
  async getFeed(params, signal) {
    feedParamsSchema.parse(params);
    signal?.throwIfAborted();
    const filtered = rows
      .map((row) => ({ ...row, distanceKm: distance(params.lat, params.lng, row) }))
      .filter((row) => row.distanceKm <= params.radius)
      .sort((a, b) => a.distanceKm - b.distanceKm || a.listingId.localeCompare(b.listingId));
    // Mock coi radius là km; đơn vị request thực cần backend xác nhận (docs/09).
    return {
      items: filtered.slice(params.page * params.size, (params.page + 1) * params.size),
      page: params.page,
      size: params.size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / params.size),
    };
  },
};
