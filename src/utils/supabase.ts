import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Helper functions to manage cookies manually
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  // Note: To make this truly HttpOnly, you cannot do it here.
  // You must set HttpOnly on the server side.
  // For client-side JS, we can only set standard cookies.
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: {
      getItem: async (key) => {
        return getCookie(key);
      },
      setItem: async (key, value) => {
        setCookie(key, value, 7); // Store for 7 days
      },
      removeItem: async (key) => {
        removeCookie(key);
      },
    },
    // Optional: If you want to auto-refresh tokens using cookies
    autoRefreshToken: true,
    persistSession: true,
  },
});
