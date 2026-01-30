/**
 * Environment Bindings for Figma MCP Server
 *
 * Type definitions for Cloudflare Worker environment variables and bindings.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant-specific credentials (Figma personal access tokens) are passed
 * via request headers, NOT stored in wrangler secrets.
 *
 * Request Headers:
 * - X-Figma-Token: Personal access token for Figma API authentication
 * - X-Figma-Base-URL: (Optional) Override the default Figma API base URL
 */

// =============================================================================
// Tenant Credentials (parsed from request headers)
// =============================================================================

export interface TenantCredentials {
  /** Figma Personal Access Token (from X-Figma-Token header) */
  accessToken?: string;

  /** Override Figma API base URL (from X-Figma-Base-URL header) */
  baseUrl?: string;
}

/**
 * Parse tenant credentials from request headers
 */
export function parseTenantCredentials(request: Request): TenantCredentials {
  const headers = request.headers;

  return {
    accessToken: headers.get('X-Figma-Token') || undefined,
    baseUrl: headers.get('X-Figma-Base-URL') || undefined,
  };
}

/**
 * Validate that required credentials are present
 */
export function validateCredentials(credentials: TenantCredentials): void {
  if (!credentials.accessToken) {
    throw new Error('Missing credentials. Provide X-Figma-Token header with your Figma personal access token.');
  }
}

// =============================================================================
// Environment Configuration (from wrangler.jsonc vars and bindings)
// =============================================================================

export interface Env {
  /** Maximum character limit for responses */
  CHARACTER_LIMIT: string;

  /** Default page size for list operations */
  DEFAULT_PAGE_SIZE: string;

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: string;

  /** KV namespace for caching (optional) */
  CACHE_KV?: KVNamespace;

  /** Durable Object namespace for MCP sessions (optional) */
  MCP_SESSIONS?: DurableObjectNamespace;

  /** Cloudflare AI binding (optional) */
  AI?: Ai;
}

// ===========================================================================
// Helper Functions
// ===========================================================================

/**
 * Get a numeric environment value with a default
 */
export function getEnvNumber(env: Env, key: keyof Env, defaultValue: number): number {
  const value = env[key];
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Get the character limit from environment
 */
export function getCharacterLimit(env: Env): number {
  return getEnvNumber(env, 'CHARACTER_LIMIT', 50000);
}

/**
 * Get the default page size from environment
 */
export function getDefaultPageSize(env: Env): number {
  return getEnvNumber(env, 'DEFAULT_PAGE_SIZE', 20);
}

/**
 * Get the maximum page size from environment
 */
export function getMaxPageSize(env: Env): number {
  return getEnvNumber(env, 'MAX_PAGE_SIZE', 100);
}
