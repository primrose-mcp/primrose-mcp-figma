/**
 * File Tools
 *
 * MCP tools for Figma file operations.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { FigmaClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all file-related tools
 */
export function registerFileTools(server: McpServer, client: FigmaClient): void {
  // ===========================================================================
  // Get File
  // ===========================================================================
  server.tool(
    'figma_get_file',
    `Get a Figma file by key.

Returns the full document structure including all pages and layers.

Args:
  - file_key: The file key (from the Figma URL)
  - version: (Optional) Specific version ID to retrieve
  - depth: (Optional) Depth of node tree to return (1-4)
  - branch_data: (Optional) Include branch metadata

Returns:
  The complete file document with all nodes, components, and styles.`,
    {
      file_key: z.string().describe('The file key from the Figma URL'),
      version: z.string().optional().describe('Specific version ID to retrieve'),
      depth: z.number().int().min(1).max(4).optional().describe('Depth of node tree to return'),
      branch_data: z.boolean().optional().describe('Include branch metadata'),
    },
    async ({ file_key, version, depth, branch_data }) => {
      try {
        const result = await client.getFile(file_key, { version, depth, branch_data });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get File Nodes
  // ===========================================================================
  server.tool(
    'figma_get_file_nodes',
    `Get specific nodes from a Figma file.

Returns JSON for specific nodes by their IDs. More efficient than getting the entire file.

Args:
  - file_key: The file key
  - ids: Array of node IDs to retrieve
  - version: (Optional) Specific version ID
  - depth: (Optional) Depth of node tree

Returns:
  The requested nodes with their properties and children.`,
    {
      file_key: z.string().describe('The file key'),
      ids: z.array(z.string()).describe('Array of node IDs to retrieve'),
      version: z.string().optional().describe('Specific version ID'),
      depth: z.number().int().min(1).max(4).optional().describe('Depth of node tree'),
    },
    async ({ file_key, ids, version, depth }) => {
      try {
        const result = await client.getFileNodes(file_key, ids, { version, depth });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get File Meta
  // ===========================================================================
  server.tool(
    'figma_get_file_meta',
    `Get file metadata without the full document.

Returns basic file information like name, last modified date, and thumbnail.
Much faster than getting the full file.

Args:
  - file_key: The file key

Returns:
  File metadata including name, lastModified, thumbnailUrl, and version.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getFileMeta(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Images (Export)
  // ===========================================================================
  server.tool(
    'figma_get_images',
    `Export images from a Figma file.

Renders specific nodes as images in various formats.

Args:
  - file_key: The file key
  - ids: Array of node IDs to render
  - format: Image format (jpg, png, svg, pdf). Default: png
  - scale: Render scale (0.01 to 4). Default: 1
  - svg_include_id: Include id attribute in SVG
  - svg_simplify_stroke: Simplify strokes in SVG
  - contents_only: Exclude containing frame for components
  - use_absolute_bounds: Use absolute bounds

Returns:
  URLs to the rendered images (valid for 14 days).`,
    {
      file_key: z.string().describe('The file key'),
      ids: z.array(z.string()).describe('Array of node IDs to render'),
      format: z.enum(['jpg', 'png', 'svg', 'pdf']).default('png').describe('Image format'),
      scale: z.number().min(0.01).max(4).default(1).describe('Render scale'),
      svg_include_id: z.boolean().optional().describe('Include id attribute in SVG'),
      svg_simplify_stroke: z.boolean().optional().describe('Simplify strokes in SVG'),
      contents_only: z.boolean().optional().describe('Exclude containing frame'),
      use_absolute_bounds: z.boolean().optional().describe('Use absolute bounds'),
    },
    async ({ file_key, ids, format, scale, svg_include_id, svg_simplify_stroke, contents_only, use_absolute_bounds }) => {
      try {
        const result = await client.getImages(file_key, ids, {
          format,
          scale,
          svg_include_id,
          svg_simplify_stroke,
          contents_only,
          use_absolute_bounds,
        });
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Image Fills
  // ===========================================================================
  server.tool(
    'figma_get_image_fills',
    `Get download links for images used as fills in a file.

Returns URLs to download images that are used as fills in the file.

Args:
  - file_key: The file key

Returns:
  Map of image references to their download URLs.`,
    {
      file_key: z.string().describe('The file key'),
    },
    async ({ file_key }) => {
      try {
        const result = await client.getImageFills(file_key);
        return formatResponse(result);
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
