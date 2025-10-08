export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'POS System',
};

