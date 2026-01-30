/**
 * Variable Tools
 *
 * MCP tools for Figma variable operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all variable-related tools
 */
export function registerVariableTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Local Variables
  // ===========================================================================
  server.tool(
    'figma_get_local_variables',
    `Get all local variables in a file.

Returns all variables and variable collections defined locally in the file.

Args:
  - file_key: The file key

Returns:
  Variables and variable collections with their values across all modes.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getLocalVariables(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Published Variables
  // ===========================================================================
  server.tool(
    'figma_get_published_variables',
    `Get all published variables in a file.

Returns variables that have been published from the file as a library.

Args:
  - file_key: The file key

Returns:
  Published variables and variable collections.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getPublishedVariables(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Modify Variables
  // ===========================================================================
  server.tool(
    'figma_modify_variables',
    `Create, update, or delete variables in a file.

Perform bulk operations on variables, variable collections, and modes.
This is a powerful operation that can modify the design system.

Args:
  - file_key: The file key
  - variable_collections: (Optional) Array of collection operations
  - variable_modes: (Optional) Array of mode operations
  - variables: (Optional) Array of variable operations
  - variable_mode_values: (Optional) Array of value assignments

Each operation requires an 'action' field: 'CREATE', 'UPDATE', or 'DELETE'.

Returns:
  Updated variables state after modifications.`,
    {
      file_key: z.string().describe('The file key'),
      variable_collections: z.array(z.object({
        action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Operation type'),
        id: z.string().optional().describe('Collection ID (required for UPDATE/DELETE)'),
        name: z.string().optional().describe('Collection name'),
        initialModeId: z.string().optional().describe('Initial mode ID for CREATE'),
      })).optional().describe('Collection operations'),
      variable_modes: z.array(z.object({
        action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Operation type'),
        id: z.string().optional().describe('Mode ID (required for UPDATE/DELETE)'),
        variableCollectionId: z.string().optional().describe('Collection ID (required for CREATE)'),
        name: z.string().optional().describe('Mode name'),
      })).optional().describe('Mode operations'),
      variables: z.array(z.object({
        action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Operation type'),
        id: z.string().optional().describe('Variable ID (required for UPDATE/DELETE)'),
        name: z.string().optional().describe('Variable name'),
        variableCollectionId: z.string().optional().describe('Collection ID (required for CREATE)'),
        resolvedType: z.enum(['BOOLEAN', 'FLOAT', 'STRING', 'COLOR']).optional().describe('Variable type'),
        description: z.string().optional().describe('Variable description'),
        hiddenFromPublishing: z.boolean().optional().describe('Hide from publishing'),
        scopes: z.array(z.string()).optional().describe('Variable scopes'),
        codeSyntax: z.record(z.string(), z.string()).optional().describe('Code syntax mapping'),
      })).optional().describe('Variable operations'),
      variable_mode_values: z.array(z.object({
        variableId: z.string().describe('Variable ID'),
        modeId: z.string().describe('Mode ID'),
        value: z.unknown().describe('Value for this mode'),
      })).optional().describe('Mode value assignments'),
    },
    async ({ file_key, variable_collections, variable_modes, variables, variable_mode_values }) => {
      try {
        const result = await client.postVariables(file_key, {
          variableCollections: variable_collections,
          variableModes: variable_modes,
          variables,
          variableModeValues: variable_mode_values,
        });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
