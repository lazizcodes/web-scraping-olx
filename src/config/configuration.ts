export default () => {
  const {
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_AUTH_SOURCE,
  } = process.env;

  return {
    port: PORT || 3000,
    mongo: {
      host: DB_HOST || 'localhost',
      user: DB_USERNAME,
      password: DB_PASSWORD,
      uri: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}`,
    },
  };
};
