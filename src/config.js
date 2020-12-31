const LOCAL_SERVER_PORT = 8000;
const LOCAL_SERVER_URL = `http://localhost:${LOCAL_SERVER_PORT}`;
const APP_PRODUCTION = process.env.NODE_ENV === 'production';
const { protocol, hostname, port } = window.location;
export const server = APP_PRODUCTION
  ? `${protocol}//${hostname}:${port}`
  : LOCAL_SERVER_URL;