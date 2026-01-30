/**
 * Dev Resource Tools
 *
 * MCP tools for Figma dev resource operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse, formatSuccess } from '../utils/formatters.js';

/**
 * Register all dev resource-related tools
 */
export function registerDevResourceTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Dev Resources
  // ===========================================================================
  server.tool(
    'figma_get_dev_resources',
    `Get dev resources for a file.

Returns links to code, documentation, and other development resources attached to nodes.

Args:
  - file_key: The file key
  - node_ids: (Optional) Filter by specific node IDs

Returns:
  List of dev resources with URLs and associated node info.`,
    {
      file_key: z.string().describe('The file key'),
      node_ids: z.array(z.string()).optional().describe('Filter by node IDs'),
    },
    async ({ file_key, node_ids }) => {
      try {
        const result = await client.getDevResources(file_key, { node_ids });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Dev Resources
  // ===========================================================================
  server.tool(
    'figma_create_dev_resources',
    `Create dev resources.

Attach links to code, documentation, or other resources to design nodes.

Args:
  - resources: Array of resources to create, each with:
    - name: Resource name
    - url: Resource URL
    - file_key: File key
    - node_id: Node ID to attach to

Returns:
  The created dev resources.`,
    {
      resources: z.array(z.object({
        name: z.string().describe('Resource name'),
        url: z.string().url().describe('Resource URL'),
        file_key: z.string().describe('File key'),
        node_id: z.string().describe('Node ID'),
      })).describe('Resources to create'),
    },
    async ({ resources }) => {
      try {
        const result = await client.createDevResources(resources);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Dev Resources
  // ===========================================================================
  server.tool(
    'figma_update_dev_resources',
    `Update existing dev resources.

Modify the name or URL of existing dev resources.

Args:
  - resources: Array of resource updates, each with:
    - id: Resource ID to update
    - name: (Optional) New name
    - url: (Optional) New URL

Returns:
  The updated dev resources.`,
    {
      resources: z.array(z.object({
        id: z.string().describe('Resource ID'),
        name: z.string().optional().describe('New name'),
        url: z.string().url().optional().describe('New URL'),
      })).describe('Resources to update'),
    },
    async ({ resources }) => {
      try {
        const result = await client.updateDevResources(resources);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Dev Resource
  // ===========================================================================
  server.tool(
    'figma_delete_dev_resource',
    `Delete a dev resource.

Remove a dev resource link from a node.

Args:
  - file_key: The file key
  - dev_resource_id: The dev resource ID to delete

Returns:
  Confirmation of deletion.`,
    {
      file_key: z.string().describe('The file key'),
      dev_resource_id: z.string().describe('The dev resource ID'),
    },
    async ({ file_key, dev_resource_id }) => {
      try {
        await client.deleteDevResource(file_key, dev_resource_id);
        return formatSuccess(`Dev resource ${dev_resource_id} deleted successfully`);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
