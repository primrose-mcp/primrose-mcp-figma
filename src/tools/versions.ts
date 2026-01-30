/**
 * Version Tools
 *
 * MCP tools for Figma file version history operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all version-related tools
 */
export function registerVersionTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get File Versions
  // ===========================================================================
  server.tool(
    'figma_get_file_versions',
    `Get version history for a Figma file.

Returns all saved versions of a file with their metadata.

Args:
  - file_key: The file key
  - page_size: (Optional) Number of versions to return per page
  - cursor: (Optional) Pagination cursor from previous response

Returns:
  List of versions with IDs, labels, descriptions, timestamps, and user info.`,
    {
      file_key: z.string().describe('The file key'),
      page_size: z.number().int().min(1).max(100).optional().describe('Number of versions per page'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, page_size, cursor }) => {
      try {
        const result = await client.getFileVersions(file_key, { page_size, cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
