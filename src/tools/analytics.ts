/**
 * Analytics Tools
 *
 * MCP tools for Figma library analytics, activity logs, and payments.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all analytics-related tools
 */
export function registerAnalyticsTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Activity Logs
  // ===========================================================================
  server.tool(
    'figma_get_activity_logs',
    `Get activity log events.

Returns audit log entries for organization activity.
Requires organization admin permissions.

Args:
  - event_type: (Optional) Filter by event type
  - limit: (Optional) Number of events to return
  - order: (Optional) Sort order ('asc' or 'desc')

Returns:
  List of activity log entries with actor, event type, and entity info.`,
    {
      event_type: z.string().optional().describe('Filter by event type'),
      limit: z.number().int().min(1).max(1000).optional().describe('Number of events'),
      order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
    },
    async ({ event_type, limit, order }) => {
      try {
        const result = await client.getActivityLogs({ event_type, limit, order });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Payments
  // ===========================================================================
  server.tool(
    'figma_get_payments',
    `Get payment information.

Query payment status for users. Requires appropriate permissions.

Args:
  - user_ids: (Optional) Filter by specific user IDs

Returns:
  Payment information for users.`,
    {
      user_ids: z.array(z.string()).optional().describe('Filter by user IDs'),
    },
    async ({ user_ids }) => {
      try {
        const result = await client.getPayments({ user_ids });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Component Actions
  // ===========================================================================
  server.tool(
    'figma_get_component_actions',
    `Get component action analytics for a library.

Returns analytics about component inserts and detaches.

Args:
  - file_key: The library file key
  - cursor: (Optional) Pagination cursor

Returns:
  Component action data with counts of inserts and detaches.`,
    {
      file_key: z.string().describe('The library file key'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, cursor }) => {
      try {
        const result = await client.getComponentActions(file_key, { cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Component Usages
  // ===========================================================================
  server.tool(
    'figma_get_component_usages',
    `Get component usage analytics for a library.

Returns analytics about how components are being used across files.

Args:
  - file_key: The library file key
  - cursor: (Optional) Pagination cursor

Returns:
  Component usage data with file and instance counts.`,
    {
      file_key: z.string().describe('The library file key'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, cursor }) => {
      try {
        const result = await client.getComponentUsages(file_key, { cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Style Actions
  // ===========================================================================
  server.tool(
    'figma_get_style_actions',
    `Get style action analytics for a library.

Returns analytics about style inserts and detaches.

Args:
  - file_key: The library file key
  - cursor: (Optional) Pagination cursor

Returns:
  Style action data with counts of inserts and detaches.`,
    {
      file_key: z.string().describe('The library file key'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, cursor }) => {
      try {
        const result = await client.getStyleActions(file_key, { cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Style Usages
  // ===========================================================================
  server.tool(
    'figma_get_style_usages',
    `Get style usage analytics for a library.

Returns analytics about how styles are being used across files.

Args:
  - file_key: The library file key
  - cursor: (Optional) Pagination cursor

Returns:
  Style usage data with file and usage counts.`,
    {
      file_key: z.string().describe('The library file key'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, cursor }) => {
      try {
        const result = await client.getStyleUsages(file_key, { cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
