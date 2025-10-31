import fs from 'fs';
import path from 'path';

export default async () => {
  const envName = process.env.ENV || 'stage';
  const envPath = path.resolve(`./env/${envName}.json`);

  if (fs.existsSync(envPath)) {
    const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

    process.env.BASE_URL = process.env.BASE_URL || envConfig.baseURL;
    process.env.USER_EMAIL = process.env.USER_EMAIL || envConfig.email;
    process.env.USER_PASSWORD = process.env.USER_PASSWORD || envConfig.password;
  }
};
