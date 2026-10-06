/**
 * Optional API address for a physical phone or Expo Go.
 *
 * Set EXPO_PUBLIC_API_URL in .env.local when the real API is available:
 *
 *   EXPO_PUBLIC_API_URL=https://your-public-api.example.com
 *
 * For a laptop API on the same Wi-Fi, use the laptop's current LAN address,
 * for example http://192.168.1.20:8000. Do not use localhost: on a phone,
 * localhost points to the phone itself. If this value is empty, the mock
 * prediction experience continues to work without a backend.
 */
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';

export const API_URL = configuredApiUrl.replace(/\/$/, '');
export const HAS_REMOTE_API = API_URL.length > 0;
