import { useQuery } from '@tanstack/react-query';
import type { FeedParams } from '@agri/contracts';
import { tradingApi } from '../../../shared/api/runtime';
import { useSession } from '../../users/hooks/useSession';
export function useListingFeed(params: FeedParams) {
  const session = useSession();
  return useQuery({
    queryKey: ['trading', 'feed', session?.accountId, params],
    enabled: !!session && (session.role === 'TRADER' || session.role === 'ADMIN'),
    queryFn: ({ signal }) => tradingApi.getFeed(params, signal),
  });
}
