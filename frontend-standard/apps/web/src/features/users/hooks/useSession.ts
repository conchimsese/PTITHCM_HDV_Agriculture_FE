import { useSyncExternalStore } from 'react';
import { getSession, subscribeSession, setSession } from '@agri/api-client';
import { queryClient, authApi } from '../../../shared/api/runtime';
export const useSession = () => useSyncExternalStore(subscribeSession, getSession, getSession);
export async function logout() {
  const originalSession = getSession();
  const tokens = originalSession?.tokens;
  try {
    if (tokens) await authApi.logout(tokens.refreshToken);
  } finally {
    if (getSession() === originalSession) {
      queryClient.clear();
      setSession(null);
    }
  }
}
