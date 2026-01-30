# Figma MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/figma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for Figma. Access design files, components, styles, and collaborate on design systems through a standardized interface.

## Features

- **File Operations** - Access and export Figma files and nodes
- **Comment Management** - Read and post comments on designs
- **Project Organization** - Navigate team projects and files
- **Version History** - Access file version history
- **Component Library** - Work with components and component sets
- **Style Management** - Access and manage design styles
- **Webhook Integration** - Set up design change notifications
- **Design Variables** - Manage design tokens and variables
- **Dev Resources** - Access developer handoff resources
- **Analytics** - Track file and component usage
- **User Information** - Access user profile data

## Quick Start

The recommended way to use this MCP server is through the [Primrose SDK](https://www.npmjs.com/package/primrose-mcp):

```bash
npm install primrose-mcp
```

```typescript
import { PrimroseClient } from 'primrose-mcp';

const client = new PrimroseClient({
  service: 'figma',
  headers: {
    'X-Figma-Token': 'your-personal-access-token'
  }
});

// Get a Figma file
const file = await client.call('figma_get_file', {
  fileKey: 'abc123xyz'
});
```

## Manual Installation

If you prefer to run the MCP server directly:

```bash
# Clone the repository
git clone https://github.com/primrose-ai/primrose-mcp-figma.git
cd primrose-mcp-figma

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Figma-Token` | Your Figma personal access token |

### Optional Headers

| Header | Description |
|--------|-------------|
| `X-Figma-Base-URL` | Override the default Figma API base URL |

### Getting Your Personal Access Token

1. Log in to [Figma](https://www.figma.com)
2. Go to Account Settings
3. Scroll to "Personal access tokens"
4. Click "Create a new personal access token"
5. Give it a description and copy the token

## Available Tools

### File Tools
- `figma_get_file` - Get a Figma file
- `figma_get_file_nodes` - Get specific nodes from a file
- `figma_get_images` - Export images from a file
- `figma_get_image_fills` - Get image fill URLs
- `figma_list_team_projects` - List team projects
- `figma_list_project_files` - List files in a project

### Comment Tools
- `figma_get_comments` - Get comments on a file
- `figma_post_comment` - Post a comment
- `figma_reply_to_comment` - Reply to a comment
- `figma_delete_comment` - Delete a comment
- `figma_get_comment_reactions` - Get comment reactions

### Project Tools
- `figma_list_team_projects` - List team projects
- `figma_list_project_files` - List project files

### Version Tools
- `figma_get_file_versions` - Get file version history
- `figma_get_file_version` - Get a specific version

### Component Tools
- `figma_get_components` - Get file components
- `figma_get_component` - Get component details
- `figma_get_team_components` - Get team component library
- `figma_get_component_sets` - Get component sets

### Style Tools
- `figma_get_styles` - Get file styles
- `figma_get_style` - Get style details
- `figma_get_team_styles` - Get team style library

### Webhook Tools
- `figma_list_webhooks` - List team webhooks
- `figma_create_webhook` - Create a webhook
- `figma_get_webhook` - Get webhook details
- `figma_update_webhook` - Update a webhook
- `figma_delete_webhook` - Delete a webhook

### Variable Tools
- `figma_get_local_variables` - Get local variables
- `figma_get_published_variables` - Get published variables
- `figma_create_variables` - Create variables
- `figma_update_variables` - Update variables

### Dev Resource Tools
- `figma_get_dev_resources` - Get dev resources for a file
- `figma_create_dev_resource` - Create a dev resource
- `figma_update_dev_resource` - Update a dev resource
- `figma_delete_dev_resource` - Delete a dev resource

### Analytics Tools
- `figma_get_file_analytics` - Get file analytics
- `figma_get_component_analytics` - Get component usage analytics

### User Tools
- `figma_get_me` - Get current user info
- `figma_get_user` - Get user by ID

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Related Resources

- [Primrose SDK Documentation](https://primrose.dev/docs)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Model Context Protocol](https://modelcontextprotocol.io)
