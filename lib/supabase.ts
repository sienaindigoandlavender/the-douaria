import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Supabase Client for Riad di Siena
// Replaces lib/sheets.ts (Google Sheets integration)
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Force every Supabase read to bypass Next.js's fetch cache so content
// edits in Supabase go live immediately (no stale/cached data).
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input as any, { ...(init || {}), cache: "no-store" });

// Public client (for read operations)
let publicClient: SupabaseClient | null = null;
function getPublicClient(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: noStoreFetch },
    });
  }
  return publicClient;
}

// Service client (for write operations — bookings, admin)
let serviceClient: SupabaseClient | null = null;
export function getServiceClient(): SupabaseClient {
  if (!serviceClient) {
    const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
    serviceClient = createClient(SUPABASE_URL, key);
  }
  return serviceClient;
}

// ============================================================
// Core query helpers
// ============================================================

/**
 * Fetch all rows from a table, ordered by "order" column if present
 */
export async function getTableData<T = Record<string, any>>(
  table: string,
  orderBy?: string
): Promise<T[]> {
  const supabase = getPublicClient();
  let query = supabase.from(table).select("*");

  if (orderBy) {
    query = query.order(orderBy, { ascending: true });
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${table}:`, error.message);
    return [];
  }
  return (data || []) as T[];
}

/**
 * Fetch rows from a table filtered by a column value
 */
export async function getFilteredData<T = Record<string, any>>(
  table: string,
  column: string,
  value: string,
  orderBy?: string
): Promise<T[]> {
  const supabase = getPublicClient();
  let query = supabase.from(table).select("*").eq(column, value);

  if (orderBy) {
    query = query.order(orderBy, { ascending: true });
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${table} where ${column}=${value}:`, error.message);
    return [];
  }
  return (data || []) as T[];
}

/**
 * Fetch a single row (first match)
 */
export async function getSingleRow<T = Record<string, any>>(
  table: string,
  column?: string,
  value?: string
): Promise<T | null> {
  const supabase = getPublicClient();
  let query = supabase.from(table).select("*");

  if (column && value) {
    query = query.eq(column, value);
  }

  const { data, error } = await query.limit(1).single();
  if (error) {
    // .single() throws PGRST116 if 0 rows — that's OK
    if (error.code === "PGRST116") return null;
    console.error(`Error fetching single from ${table}:`, error.message);
    return null;
  }
  return data as T;
}

/**
 * Insert a row using the service client (for bookings, admin writes)
 */
export async function insertRow(
  table: string,
  data: Record<string, any>
): Promise<boolean> {
  const supabase = getServiceClient();
  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.error(`Error inserting into ${table}:`, error.message);
    return false;
  }
  return true;
}

/**
 * Update rows matching a filter
 */
export async function updateRows(
  table: string,
  filter: { column: string; value: string },
  updates: Record<string, any>
): Promise<boolean> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from(table)
    .update(updates)
    .eq(filter.column, filter.value);
  if (error) {
    console.error(`Error updating ${table}:`, error.message);
    return false;
  }
  return true;
}

// ============================================================
// Settings helpers (replaces getAllSettings / getSetting)
// ============================================================

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await getTableData<{ key: string; value: string }>("settings");
  const obj: Record<string, string> = {};
  rows.forEach((r) => {
    if (r.key) obj[r.key] = r.value || "";
  });
  return obj;
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await getSingleRow<{ key: string; value: string }>(
    "settings",
    "key",
    key
  );
  return row?.value || null;
}

// ============================================================
// Content types (same interface as sheets.ts)
// ============================================================

export interface ContentBlock {
  section: string;
  title: string;
  subtitle: string;
  body: string;
  image_url: string;
  order: number;
  button_text?: string;
  button_link?: string;
}

/**
 * Get sectioned content (keyed by section column) — replaces getPageContent
 */
export async function getSectionedContent(
  table: string
): Promise<Record<string, ContentBlock>> {
  const rows = await getTableData<ContentBlock>(table, "order");
  const obj: Record<string, ContentBlock> = {};
  rows.forEach((r) => {
    if (r.section) {
      obj[r.section] = {
        ...r,
        image_url: convertDriveUrl(r.image_url || ""),
      };
    }
  });
  return obj;
}

// ============================================================
// Image URL converter (for Google Drive URLs)
// ============================================================

export function convertDriveUrl(url: string): string {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;

  let fileId = "";

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) fileId = openMatch[1];

  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) fileId = ucMatch[1];

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
  }
  return url;
}

// ============================================================
// Nexus system — see lib/nexus.ts (Supabase)
// ============================================================
