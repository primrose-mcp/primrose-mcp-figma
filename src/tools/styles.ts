/**
 * Style Tools
 *
 * MCP tools for Figma style operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all style-related tools
 */
export function registerStyleTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Team Styles
  // ===========================================================================
  server.tool(
    'figma_get_team_styles',
    `Get all styles published to a team library.

Lists all published styles (colors, text, effects, grids) from team libraries.

Args:
  - team_id: The team ID
  - page_size: (Optional) Number of styles per page
  - cursor: (Optional) Pagination cursor

Returns:
  List of styles with metadata including keys, names, descriptions, and style types.`,
    {
      team_id: z.string().describe('The team ID'),
      page_size: z.number().int().min(1).max(100).optional().describe('Number of styles per page'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ team_id, page_size, cursor }) => {
      try {
        const result = await client.getTeamStyles(team_id, { page_size, cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get File Styles
  // ===========================================================================
  server.tool(
    'figma_get_file_styles',
    `Get all styles in a file.

Lists all styles within a specific file.

Args:
  - file_key: The file key

Returns:
  List of styles with their metadata.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getFileStyles(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Style
  // ===========================================================================
  server.tool(
    'figma_get_style',
    `Get metadata for a specific style.

Returns detailed information about a published style.

Args:
  - style_key: The style key

Returns:
  Style metadata including name, description, type, and file key.`,
    {
      style_key: z.string().describe('The style key'),
    },
    async ({ style_key }) => {
      try {
        const result = await client.getStyle(style_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
