/**
 * Comment Tools
 *
 * MCP tools for Figma comment operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse, formatSuccess } from '../utils/formatters.js';

/**
 * Register all comment-related tools
 */
export function registerCommentTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get Comments
  // ===========================================================================
  server.tool(
    'figma_get_comments',
    `Get all comments on a Figma file.

Returns all comments including resolved comments and replies.

Args:
  - file_key: The file key
  - as_md: (Optional) Return message content as markdown

Returns:
  List of all comments with user info, timestamps, and thread structure.`,
    {
      file_key: z.string().describe('The file key'),
      as_md: z.boolean().optional().describe('Return message content as markdown'),
    },
    async ({ file_key, as_md }) => {
      try {
        const result = await client.getComments(file_key, { as_md });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Post Comment
  // ===========================================================================
  server.tool(
    'figma_post_comment',
    `Post a comment on a Figma file.

Create a new comment or reply to an existing comment.

Args:
  - file_key: The file key
  - message: The comment message
  - comment_id: (Optional) ID of comment to reply to
  - node_id: (Optional) Node ID to attach comment to
  - x: (Optional) X coordinate for comment position
  - y: (Optional) Y coordinate for comment position

Returns:
  The created comment with its ID and metadata.`,
    {
      file_key: z.string().describe('The file key'),
      message: z.string().describe('The comment message'),
      comment_id: z.string().optional().describe('ID of comment to reply to'),
      node_id: z.string().optional().describe('Node ID to attach comment to'),
      x: z.number().optional().describe('X coordinate for comment position'),
      y: z.number().optional().describe('Y coordinate for comment position'),
    },
    async ({ file_key, message, comment_id, node_id, x, y }) => {
      try {
        const client_meta = node_id || x !== undefined || y !== undefined
          ? { node_id, x, y }
          : undefined;
        const result = await client.postComment(file_key, message, { comment_id, client_meta });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Comment
  // ===========================================================================
  server.tool(
    'figma_delete_comment',
    `Delete a comment from a Figma file.

Permanently removes a comment. Only the comment author can delete it.

Args:
  - file_key: The file key
  - comment_id: The comment ID to delete

Returns:
  Confirmation of deletion.`,
    {
      file_key: z.string().describe('The file key'),
      comment_id: z.string().describe('The comment ID to delete'),
    },
    async ({ file_key, comment_id }) => {
      try {
        await client.deleteComment(file_key, comment_id);
        return formatSuccess(`Comment ${comment_id} deleted successfully`);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Comment Reactions
  // ===========================================================================
  server.tool(
    'figma_get_comment_reactions',
    `Get reactions on a comment.

Returns all emoji reactions on a specific comment.

Args:
  - file_key: The file key
  - comment_id: The comment ID
  - cursor: (Optional) Pagination cursor

Returns:
  List of reactions with user and emoji info.`,
    {
      file_key: z.string().describe('The file key'),
      comment_id: z.string().describe('The comment ID'),
      cursor: z.string().optional().describe('Pagination cursor'),
    },
    async ({ file_key, comment_id, cursor }) => {
      try {
        const result = await client.getCommentReactions(file_key, comment_id, { cursor });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Post Comment Reaction
  // ===========================================================================
  server.tool(
    'figma_post_comment_reaction',
    `Add a reaction to a comment.

React to a comment with an emoji.

Args:
  - file_key: The file key
  - comment_id: The comment ID
  - emoji: The emoji to react with (e.g., ":heart:", ":+1:")

Returns:
  Confirmation of reaction added.`,
    {
      file_key: z.string().describe('The file key'),
      comment_id: z.string().describe('The comment ID'),
      emoji: z.string().describe('The emoji to react with'),
    },
    async ({ file_key, comment_id, emoji }) => {
      try {
        await client.postCommentReaction(file_key, comment_id, emoji);
        return formatSuccess(`Reaction ${emoji} added to comment ${comment_id}`);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Comment Reaction
  // ===========================================================================
  server.tool(
    'figma_delete_comment_reaction',
    `Remove a reaction from a comment.

Remove your emoji reaction from a comment.

Args:
  - file_key: The file key
  - comment_id: The comment ID
  - emoji: The emoji to remove

Returns:
  Confirmation of reaction removed.`,
    {
      file_key: z.string().describe('The file key'),
      comment_id: z.string().describe('The comment ID'),
      emoji: z.string().describe('The emoji to remove'),
    },
    async ({ file_key, comment_id, emoji }) => {
      try {
        await client.deleteCommentReaction(file_key, comment_id, emoji);
        return formatSuccess(`Reaction ${emoji} removed from comment ${comment_id}`);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
