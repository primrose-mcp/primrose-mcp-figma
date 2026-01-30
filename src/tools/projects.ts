/**
 * Project & Team Tools
 *
 * MCP tools for Figma team and project operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all project and team-related tools
 */
export function registerProjectTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Team Projects
  // ===========================================================================
  server.tool(
    'figma_get_team_projects',
    `Get all projects in a team.

Lists all projects within a specific team.

Args:
  - team_id: The team ID

Returns:
  List of projects with their IDs and names.`,
    {
      team_id: z.string().describe('The team ID'),
    },
    async ({ team_id }) => {
      try {
        const result = await client.getTeamProjects(team_id);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Project Files
  // ===========================================================================
  server.tool(
    'figma_get_project_files',
    `Get all files in a project.

Lists all files within a specific project.

Args:
  - project_id: The project ID
  - branch_data: (Optional) Include branch information

Returns:
  List of files with their keys, names, thumbnails, and last modified dates.`,
    {
      project_id: z.string().describe('The project ID'),
      branch_data: z.boolean().optional().describe('Include branch information'),
    },
    async ({ project_id, branch_data }) => {
      try {
        const result = await client.getProjectFiles(project_id, { branch_data });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
