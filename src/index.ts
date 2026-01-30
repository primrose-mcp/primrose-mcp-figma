/**
 * Figma MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It provides access to the full Figma REST API through MCP tools.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (Figma personal access tokens) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-Figma-Token: Personal access token for Figma API authentication
 *
 * Optional Headers:
 * - X-Figma-Base-URL: Override the default Figma API base URL
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createFigmaClient } from './client.js';
import {
  registerAnalyticsTools,
  registerCommentTools,
  registerComponentTools,
  registerDevResourceTools,
  registerFileTools,
  registerProjectTools,
  registerStyleTools,
  registerUserTools,
  registerVariableTools,
  registerVersionTools,
  registerWebhookTools,
} from './tools/index.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-figma';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode instead.
 * The stateful McpAgent is better suited for single-tenant deployments.
 *
 * @deprecated For multi-tenant support, use stateless mode with per-request credentials
 */
export class FigmaMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Figma-Token header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createFigmaClient(credentials);

  // Register all tool categories
  registerFileTools(server, client);
  registerCommentTools(server, client);
  registerProjectTools(server, client);
  registerVersionTools(server, client);
  registerComponentTools(server, client);
  registerStyleTools(server, client);
  registerWebhookTools(server, client);
  registerVariableTools(server, client);
  registerDevResourceTools(server, client);
  registerAnalyticsTools(server, client);
  registerUserTools(server, client);

  // Test connection tool
  server.tool(
    'figma_test_connection',
    'Test the connection to the Figma API and return the authenticated user info.',
    {},
    async () => {
      try {
        const result = await client.testConnection();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Figma-Token'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Multi-tenant Figma MCP Server - Access the full Figma REST API',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass Figma personal access token via request header',
          required_headers: {
            'X-Figma-Token': 'Your Figma personal access token',
          },
          optional_headers: {
            'X-Figma-Base-URL': 'Override the default Figma API base URL',
          },
        },
        tools: [
          // Files
          'figma_get_file',
          'figma_get_file_nodes',
          'figma_get_file_meta',
          'figma_get_images',
          'figma_get_image_fills',
          // Comments
          'figma_get_comments',
          'figma_post_comment',
          'figma_delete_comment',
          'figma_get_comment_reactions',
          'figma_post_comment_reaction',
          'figma_delete_comment_reaction',
          // Projects & Teams
          'figma_get_team_projects',
          'figma_get_project_files',
          // Versions
          'figma_get_file_versions',
          // Components
          'figma_get_team_components',
          'figma_get_file_components',
          'figma_get_component',
          'figma_get_team_component_sets',
          'figma_get_file_component_sets',
          'figma_get_component_set',
          // Styles
          'figma_get_team_styles',
          'figma_get_file_styles',
          'figma_get_style',
          // Webhooks
          'figma_get_webhooks',
          'figma_create_webhook',
          'figma_get_webhook',
          'figma_update_webhook',
          'figma_delete_webhook',
          'figma_get_webhook_requests',
          // Variables
          'figma_get_local_variables',
          'figma_get_published_variables',
          'figma_modify_variables',
          // Dev Resources
          'figma_get_dev_resources',
          'figma_create_dev_resources',
          'figma_update_dev_resources',
          'figma_delete_dev_resource',
          // Analytics
          'figma_get_activity_logs',
          'figma_get_payments',
          'figma_get_component_actions',
          'figma_get_component_usages',
          'figma_get_style_actions',
          'figma_get_style_usages',
          // Users
          'figma_get_me',
          // Utility
          'figma_test_connection',
        ],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
