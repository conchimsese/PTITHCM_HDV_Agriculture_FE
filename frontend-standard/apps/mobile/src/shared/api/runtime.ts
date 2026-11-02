import { QueryClient } from '@tanstack/react-query';
import {
  createApiClient,
  createAuthApi,
  createTradingApi,
  mockTradingApi,
  getSession,
  setSession,
  ApiError,
} from '@agri/api-client';
import { env } from '../config/env';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        !(error instanceof ApiError && [401, 403, 404, 409, 429].includes(error.status)) &&
        count < 1,
    },
    mutations: { retry: false },
  },
});
export const http = createApiClient({
  baseUrl: env.gatewayUrl,
  getAccessToken: () => getSession()?.tokens?.accessToken,
  onUnauthorized: (sentToken) => {
    // Không để response cũ đăng xuất phiên vừa login lại.
    if (sentToken === getSession()?.tokens?.accessToken) {
      queryClient.clear();
      setSession(null);
    }
  },
});
export const authApi = createAuthApi(http);
// Chọn nguồn một lần. API lỗi phải hiển thị lỗi, tuyệt đối không fallback sang mock.
export const tradingApi = env.dataSource === 'mock' ? mockTradingApi : createTradingApi(http);
