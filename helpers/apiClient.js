// helpers/apiClient.js
import { request, expect } from '@playwright/test';

export class ApiClient {
  constructor(baseURL, authToken = null) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async init() {
    console.log('🧩 Base URL:', this.baseURL);
    console.log('🔐 Auth Token:', this.authToken);
    this.api = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.authToken
        ? { Authorization: `Bearer ${this.authToken}` }
        : {},
    });
  }

  async request(method, endpoint, body = null, expectSuccess = true) {
    const options = body ? { data: body } : {};
    const res = await this.api[method](endpoint, options);

    console.log(`API ${method.toUpperCase()} ${endpoint} → ${res.status()}`);
    // ✅ Only enforce success if expectSuccess = true
    if (expectSuccess) {
      expect(res.ok()).toBeTruthy();
    }

    // Return full response (status + json)
    const json = await res.json().catch(() => ({})); // handle non-JSON responses
    return { status: res.status(), body: json };
  }

  // Shortcuts for convenience
  async get(endpoint, expectSuccess = true) {
    return this.request('get', endpoint, null, expectSuccess);
  }

  async post(endpoint, body, expectSuccess = true) {
    return this.request('post', endpoint, body, expectSuccess);
  }

  async put(endpoint, body, expectSuccess = true) {
    return this.request('put', endpoint, body, expectSuccess);
  }

  async delete(endpoint, expectSuccess = true) {
    return this.request('delete', endpoint, null, expectSuccess);
  }
}
