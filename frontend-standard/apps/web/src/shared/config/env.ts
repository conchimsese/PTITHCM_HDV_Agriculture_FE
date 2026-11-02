const dataSource = import.meta.env.VITE_DATA_SOURCE ?? 'mock';
if (dataSource !== 'mock' && dataSource !== 'api')
  throw new Error('VITE_DATA_SOURCE phải là mock hoặc api');
export const env = {
  dataSource,
  gatewayUrl: import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:8080',
} as const;
