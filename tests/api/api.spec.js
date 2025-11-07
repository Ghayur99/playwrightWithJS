// tests/api/users.spec.js
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/apiClient.js';
import fs from 'fs';
import path from 'path';

test.describe('User Management API', () => {
  let api, authToken;

  test.beforeAll(async () => {
    // Simple: read token from auth.json (first origin/localStorage token)
    try {
      const authPath = path.resolve(process.cwd(), 'auth.json');
      const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
      authToken = auth?.origins?.[0]?.localStorage?.find(e => e.name === 'token')?.value;
      console.log('Auth token loaded:', !!authToken);
    } catch (e) {
      console.warn('auth.json not found or invalid, continuing without token');
    }

    api = new ApiClient(process.env.BASE_URL_API, authToken);
    await api.init();
  });

  test('GET /users → should fetch user list', async () => {
    const users = await api.get('dashboard/users/me');
    expect(users.status).toBe(200);
    // ✅ Verify email field exists and matches
    expect(users.body).toHaveProperty('contactMethods.email');
    expect(users.body.contactMethods.email.enabled).toBe(true);
    expect(users.body.contactMethods.email.value).toBe('mussadiq+4@faba.naibme.com');
  });
});
