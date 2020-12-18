export const LOCAL_SERVER_PORT = 8000;
export const LOCAL_SERVER_URL = `http://localhost:${LOCAL_SERVER_PORT}`;
export const APP_PRODUCTION = process.env.NODE_ENV === 'production'
  ? true
  : false;
