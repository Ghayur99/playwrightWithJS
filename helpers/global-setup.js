import fs from 'fs';
import path from 'path';

export default async () => {
  const envName = process.env.ENV || 'stage';
  const envPath = path.resolve(`./env/${envName}.json`);
  const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

  // Expose globally
  process.env.BASE_URL = envConfig.baseURL;
  process.env.USER_EMAIL = envConfig.email;
  process.env.USER_PASSWORD = envConfig.password;
};