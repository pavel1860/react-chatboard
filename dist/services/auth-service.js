// apiClient.ts
// import fetch, { HeadersInit } from 'node-fetch';
// import { User } from './types';
const API_URL = `${process.env.BACKEND_URL}/api`;
// 1. Create guest user
export async function createGuestUser(data = {}) {
    const response = await fetch(`${API_URL}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok)
        throw new Error(`Guest create failed: ${await response.text()}`);
    return response.json();
}
// 2. Register user
export async function registerUser(auth_user_id, data) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth_user_id, data })
    });
    if (!response.ok)
        throw new Error(`Register failed: ${await response.text()}`);
    return response.json();
}
// 3. Promote guest
export async function promoteGuestUser(guest_token, auth_user_id, data) {
    const body = { guest_token, auth_user_id, data };
    const response = await fetch(`${API_URL}/auth/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok)
        throw new Error(`Promote failed: ${await response.text()}`);
    return response.json();
}
// 4. Fetch current user (cookie or header logic)
export async function fetchCurrentUser(options) {
    let headers = { 'Content-Type': 'application/json' };
    // Send identifier as header or cookie
    if (options.authUserId) {
        headers['X-Auth-User'] = options.authUserId;
    }
    // node-fetch uses the 'cookie' header for sending cookies
    if (options.guestToken) {
        headers['cookie'] = `temp_user_token=${options.guestToken}`;
    }
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers
    });
    if (!response.ok) {
        if (response.status === 401) {
            if (options.errorOn401) {
                throw new Error(`Fetch current user failed: ${await response.text()}`);
            }
            else {
                return null;
            }
        }
        throw new Error(`Fetch current user failed: ${await response.text()}`);
    }
    return response.json();
}
//# sourceMappingURL=auth-service.js.map