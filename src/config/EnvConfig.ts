export class EnvConfig {
  static get databaseURL(): string {
    const databaseURL = process.env.DATABASE_URL;
    if (!databaseURL) {
      console.error('databaseURL not found');
    }
    return databaseURL;
  }

  static get jwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('jwt secret not found');
    }
    return jwtSecret;
  }
}
