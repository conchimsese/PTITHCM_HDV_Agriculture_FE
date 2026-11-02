import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/runtime';
// Thêm router/layout và màn hình thật tại đây.
export function App() {
  return <QueryClientProvider client={queryClient}>{null}</QueryClientProvider>;
}
