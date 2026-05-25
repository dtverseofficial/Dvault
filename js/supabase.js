// Supabase connection for Dvault.
// Put your own Project URL and anon public key below.
export const SUPABASE_URL = "https://dlwrptjbbpkkgqdvqgju.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd3JwdGpiYnBra2dxZHZxZ2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODY2MjUsImV4cCI6MjA5NTI2MjYyNX0.URq5ZVQY_NkJTSdx2QPy6oUqnk4ewL_ttWNTt26XfBw";

const hasSupabaseCdn = !!window.supabase?.createClient;
const hasRealUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL.trim());
const hasRealAnonKey = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(SUPABASE_ANON_KEY.trim());

export const SUPABASE_CONFIGURED = hasSupabaseCdn && hasRealUrl && hasRealAnonKey;

export const db = SUPABASE_CONFIGURED
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export async function getSession(){
  if(!db) return null;
  const { data, error } = await db.auth.getSession();
  if(error) throw error;
  return data.session;
}

export async function getUser(){
  if(!db) return null;
  const { data, error } = await db.auth.getUser();
  if(error) throw error;
  return data.user;
}
