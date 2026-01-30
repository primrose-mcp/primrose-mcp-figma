/**
 * Component Tools
 *
 * MCP tools for Figma component operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all component-related tools
 */
export function registerComponentTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Team Components
  // ===========================================================================
  server.tool(
    'figma_get_team_components',
    `Get all components published to a team library.

Lists all published components from team libraries.

Args:
  - team_id: The team ID
  - page_size: (Optional) Number of components per page
  - cursor: (Optional) Pagination cursor

Returns:
  List of components with metadata including keys, names, descriptions, and thumbnails.`,
    {
      team_id: z.string().describe('The team ID'),
      page_size: z.number().int().min(1).max(100).optional().describe('Number of components per page'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ team_id, page_size, cursor }) => {
      try {
        const result = await client.getTeamComponents(team_id, { page_size, cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get File Components
  // ===========================================================================
  server.tool(
    'figma_get_file_components',
    `Get all components in a file.

Lists all components within a specific file.

Args:
  - file_key: The file key

Returns:
  List of components with their metadata.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getFileComponents(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Component
  // ===========================================================================
  server.tool(
    'figma_get_component',
    `Get metadata for a specific component.

Returns detailed information about a published component.

Args:
  - component_key: The component key

Returns:
  Component metadata including name, description, file key, and containing frame info.`,
    {
      component_key: z.string().describe('The component key'),
    },
    async ({ component_key }) => {
      try {
        const result = await client.getComponent(component_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Team Component Sets
  // ===========================================================================
  server.tool(
    'figma_get_team_component_sets',
    `Get all component sets published to a team library.

Lists all published component sets (variants) from team libraries.

Args:
  - team_id: The team ID
  - page_size: (Optional) Number of component sets per page
  - cursor: (Optional) Pagination cursor

Returns:
  List of component sets with metadata.`,
    {
      team_id: z.string().describe('The team ID'),
      page_size: z.number().int().min(1).max(100).optional().describe('Number of component sets per page'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ team_id, page_size, cursor }) => {
      try {
        const result = await client.getTeamComponentSets(team_id, { page_size, cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get File Component Sets
  // ===========================================================================
  server.tool(
    'figma_get_file_component_sets',
    `Get all component sets in a file.

Lists all component sets within a specific file.

Args:
  - file_key: The file key

Returns:
  List of component sets with their metadata.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getFileComponentSets(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Component Set
  // ===========================================================================
  server.tool(
    'figma_get_component_set',
    `Get metadata for a specific component set.

Returns detailed information about a published component set (variant group).

Args:
  - component_set_key: The component set key

Returns:
  Component set metadata including name, description, and containing frame info.`,
    {
      component_set_key: z.string().describe('The component set key'),
    },
    async ({ component_set_key }) => {
      try {
        const result = await client.getComponentSet(component_set_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
