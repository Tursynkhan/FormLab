
export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
  accessExpiration: '1m',
  refreshExpiration: '7d'
};
