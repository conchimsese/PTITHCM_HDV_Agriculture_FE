import { tokenPairSchema, type LoginRequest } from '@agri/contracts';
import type { ApiClient } from './http';
export const createAuthApi = (http: ApiClient) => ({
  login: (body: LoginRequest) =>
    http.request('/api/v1/auth/login', {
      method: 'POST',
      body,
      auth: false,
      schema: tokenPairSchema,
    }),
  logout: (refreshToken: string) =>
    http.request('/api/v1/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    }),
});
// Baseline hiện trả về login khi 401. Refresh single-flight là công việc trong docs/06.
