/**
 * Webhook Tools
 *
 * MCP tools for Figma webhook operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse, formatSuccess } from '../utils/formatters.js';

/**
 * Register all webhook-related tools
 */
export function registerWebhookTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Webhooks
  // ===========================================================================
  server.tool(
    'figma_get_webhooks',
    `Get all webhooks.

Lists all webhooks, optionally filtered by team.

Args:
  - team_id: (Optional) Filter webhooks by team ID

Returns:
  List of webhooks with their configurations.`,
    {
      team_id: z.string().optional().describe('Filter by team ID'),
    },
    async ({ team_id }) => {
      try {
        const result = await client.getWebhooks({ team_id });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Webhook
  // ===========================================================================
  server.tool(
    'figma_create_webhook',
    `Create a new webhook.

Create a webhook to receive notifications for file events.

Args:
  - event_type: Event type (FILE_UPDATE, FILE_VERSION_UPDATE, FILE_DELETE, FILE_COMMENT, LIBRARY_PUBLISH)
  - team_id: Team ID to monitor
  - endpoint: URL to receive webhook payloads
  - passcode: Secret passcode for verification
  - status: (Optional) ACTIVE or PAUSED
  - description: (Optional) Webhook description

Returns:
  The created webhook configuration.`,
    {
      event_type: z.enum(['FILE_UPDATE', 'FILE_VERSION_UPDATE', 'FILE_DELETE', 'FILE_COMMENT', 'LIBRARY_PUBLISH']).describe('Event type to subscribe to'),
      team_id: z.string().describe('Team ID to monitor'),
      endpoint: z.string().url().describe('URL to receive webhook payloads'),
      passcode: z.string().describe('Secret passcode for verification'),
      status: z.enum(['ACTIVE', 'PAUSED']).optional().describe('Webhook status'),
      description: z.string().optional().describe('Webhook description'),
    },
    async ({ event_type, team_id, endpoint, passcode, status, description }) => {
      try {
        const result = await client.createWebhook({
          event_type,
          team_id,
          endpoint,
          passcode,
          status,
          description,
        });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Webhook
  // ===========================================================================
  server.tool(
    'figma_get_webhook',
    `Get a specific webhook by ID.

Args:
  - webhook_id: The webhook ID

Returns:
  The webhook configuration.`,
    {
      webhook_id: z.string().describe('The webhook ID'),
    },
    async ({ webhook_id }) => {
      try {
        const result = await client.getWebhook(webhook_id);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Webhook
  // ===========================================================================
  server.tool(
    'figma_update_webhook',
    `Update an existing webhook.

Args:
  - webhook_id: The webhook ID to update
  - event_type: (Optional) New event type
  - endpoint: (Optional) New endpoint URL
  - passcode: (Optional) New passcode
  - status: (Optional) ACTIVE or PAUSED
  - description: (Optional) New description

Returns:
  The updated webhook configuration.`,
    {
      webhook_id: z.string().describe('The webhook ID'),
      event_type: z.enum(['FILE_UPDATE', 'FILE_VERSION_UPDATE', 'FILE_DELETE', 'FILE_COMMENT', 'LIBRARY_PUBLISH']).optional().describe('Event type'),
      endpoint: z.string().url().optional().describe('Endpoint URL'),
      passcode: z.string().optional().describe('Passcode'),
      status: z.enum(['ACTIVE', 'PAUSED']).optional().describe('Status'),
      description: z.string().optional().describe('Description'),
    },
    async ({ webhook_id, event_type, endpoint, passcode, status, description }) => {
      try {
        const result = await client.updateWebhook(webhook_id, {
          event_type,
          endpoint,
          passcode,
          status,
          description,
        });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Webhook
  // ===========================================================================
  server.tool(
    'figma_delete_webhook',
    `Delete a webhook.

Permanently removes a webhook subscription.

Args:
  - webhook_id: The webhook ID to delete

Returns:
  Confirmation of deletion.`,
    {
      webhook_id: z.string().describe('The webhook ID'),
    },
    async ({ webhook_id }) => {
      try {
        await client.deleteWebhook(webhook_id);
        return formatSuccess(`Webhook ${webhook_id} deleted successfully`);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Webhook Requests
  // ===========================================================================
  server.tool(
    'figma_get_webhook_requests',
    `Get recent webhook requests for debugging.

Returns the history of recent webhook deliveries for debugging.

Args:
  - webhook_id: The webhook ID

Returns:
  List of recent webhook requests with payloads and response statuses.`,
    {
      webhook_id: z.string().describe('The webhook ID'),
    },
    async ({ webhook_id }) => {
      try {
        const result = await client.getWebhookRequests(webhook_id);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
