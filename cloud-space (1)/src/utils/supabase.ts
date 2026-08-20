import { createClient } from '@supabase/supabase-js';

// Default Supabase credentials provided for Cloud Space
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ugirvjbddkossptwrwwo.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_AR3kO3d_OApEOX_L4lckOw_42qM-350';

/**
 * Supabase client instance initialized with project credentials
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Checks connection health to the configured Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  error?: string;
  url: string;
}> {
  try {
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return { connected: false, error: 'Missing Supabase credentials', url: SUPABASE_URL };
    }
    // Attempt a light ping or read to verify endpoint reachable
    const { error } = await supabase.from('files').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "files" does not exist')) {
      // Even if the table doesn't exist yet, reaching the schema endpoint proves connectivity
      if (error.message.includes('relation') || error.message.includes('not found') || error.code === '42P01') {
        return { connected: true, url: SUPABASE_URL };
      }
      return { connected: false, error: error.message, url: SUPABASE_URL };
    }
    return { connected: true, url: SUPABASE_URL };
  } catch (err: any) {
    return { connected: false, error: err?.message || 'Connection failed', url: SUPABASE_URL };
  }
}
