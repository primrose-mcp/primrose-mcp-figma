/**
 * User Tools
 *
 * MCP tools for Figma user operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all user-related tools
 */
export function registerUserTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Current User
  // ===========================================================================
  server.tool(
    'figma_get_me',
    `Get the current authenticated user.

Returns information about the user associated with the access token.

Returns:
  User info including id, handle, email, and profile image URL.`,
    {},
    async () => {
      try {
        const result = await client.getMe();
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
