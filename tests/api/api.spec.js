// tests/api/users.spec.js
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/apiClient.js';

test.describe('User Management API', () => {
  let api, authToken;

  test.beforeAll(async () => {
    // Step 1: Login to get token
    console.log(process.env.BASE_URL_API)
    const loginClient = new ApiClient(process.env.BASE_URL_API);
    await loginClient.init();

    const loginRes = await loginClient.post('dashboard/users/login', {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });

    // ✅ Token is directly in the root of response
    authToken = loginRes.body?.token;

    console.log('✅ Auth token:', authToken);
    // Step 2: Initialize authorized client
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
