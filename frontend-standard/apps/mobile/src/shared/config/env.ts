const dataSource = process.env.EXPO_PUBLIC_DATA_SOURCE ?? 'mock';
if (dataSource !== 'mock' && dataSource !== 'api')
  throw new Error('EXPO_PUBLIC_DATA_SOURCE phải là mock hoặc api');
export const env = {
  dataSource,
  gatewayUrl: process.env.EXPO_PUBLIC_GATEWAY_URL ?? 'http://10.0.2.2:8080',
} as const;
