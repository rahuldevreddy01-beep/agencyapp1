import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Simple in-memory storage (no native module required)
// Sessions reset on app restart — good enough for now
const memoryStorage = {
  _store: {} as Record<string, string>,
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this._store[key] ?? null);
  },
  setItem(key: string, value: string): Promise<void> {
    this._store[key] = value;
    return Promise.resolve();
  },
  removeItem(key: string): Promise<void> {
    delete this._store[key];
    return Promise.resolve();
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: memoryStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
