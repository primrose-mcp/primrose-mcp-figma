/**
 * Figma API Client
 *
 * Handles all HTTP communication with the Figma REST API.
 *
 * MULTI-TENANT: This client receives credentials per-request via TenantCredentials,
 * allowing a single server to serve multiple tenants with different access tokens.
 */

import type {
  ActivityLogsResponse,
  CommentReactionsResponse,
  CommentsResponse,
  ComponentResponse,
  ComponentSetResponse,
  ComponentSetsResponse,
  ComponentsResponse,
  DevResourceCreateInput,
  DevResourcesResponse,
  DevResourceUpdateInput,
  FileMetaResponse,
  FileNodesResponse,
  FileResponse,
  ImageFillsResponse,
  ImageFormat,
  ImagesResponse,
  LibraryAnalyticsResponse,
  LocalVariablesResponse,
  PaymentsResponse,
  PostCommentResponse,
  ProjectFilesResponse,
  ProjectsResponse,
  PublishedVariablesResponse,
  StyleResponse,
  StylesResponse,
  User,
  VersionsResponse,
  WebhookRequestsResponse,
  WebhookResponse,
  WebhooksResponse,
} from './types/figma.js';
import type { TenantCredentials } from './types/env.js';
import { AuthenticationError, FigmaApiError, ForbiddenError, NotFoundError, RateLimitError } from './utils/errors.js';

// =============================================================================
// Configuration
// =============================================================================

const FIGMA_API_BASE_URL = 'https://api.figma.com';

// =============================================================================
// Figma Client Interface
// =============================================================================

export interface FigmaClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string; user?: User }>;

  // Files
  getFile(fileKey: string, options?: GetFileOptions): Promise<FileResponse>;
  getFileNodes(fileKey: string, ids: string[], options?: GetFileNodesOptions): Promise<FileNodesResponse>;
  getFileMeta(fileKey: string): Promise<FileMetaResponse>;
  getImages(fileKey: string, ids: string[], options?: GetImagesOptions): Promise<ImagesResponse>;
  getImageFills(fileKey: string): Promise<ImageFillsResponse>;

  // Versions
  getFileVersions(fileKey: string, options?: PaginationOptions): Promise<VersionsResponse>;

  // Comments
  getComments(fileKey: string, options?: GetCommentsOptions): Promise<CommentsResponse>;
  postComment(fileKey: string, message: string, options?: PostCommentOptions): Promise<PostCommentResponse>;
  deleteComment(fileKey: string, commentId: string): Promise<void>;
  getCommentReactions(fileKey: string, commentId: string, options?: PaginationOptions): Promise<CommentReactionsResponse>;
  postCommentReaction(fileKey: string, commentId: string, emoji: string): Promise<void>;
  deleteCommentReaction(fileKey: string, commentId: string, emoji: string): Promise<void>;

  // Users
  getMe(): Promise<User>;

  // Teams & Projects
  getTeamProjects(teamId: string): Promise<ProjectsResponse>;
  getProjectFiles(projectId: string, options?: GetProjectFilesOptions): Promise<ProjectFilesResponse>;

  // Components
  getTeamComponents(teamId: string, options?: PaginationOptions): Promise<ComponentsResponse>;
  getFileComponents(fileKey: string): Promise<ComponentsResponse>;
  getComponent(componentKey: string): Promise<ComponentResponse>;

  // Component Sets
  getTeamComponentSets(teamId: string, options?: PaginationOptions): Promise<ComponentSetsResponse>;
  getFileComponentSets(fileKey: string): Promise<ComponentSetsResponse>;
  getComponentSet(componentSetKey: string): Promise<ComponentSetResponse>;

  // Styles
  getTeamStyles(teamId: string, options?: PaginationOptions): Promise<StylesResponse>;
  getFileStyles(fileKey: string): Promise<StylesResponse>;
  getStyle(styleKey: string): Promise<StyleResponse>;

  // Webhooks
  getWebhooks(options?: GetWebhooksOptions): Promise<WebhooksResponse>;
  createWebhook(input: CreateWebhookInput): Promise<WebhookResponse>;
  getWebhook(webhookId: string): Promise<WebhookResponse>;
  updateWebhook(webhookId: string, input: UpdateWebhookInput): Promise<WebhookResponse>;
  deleteWebhook(webhookId: string): Promise<void>;
  getWebhookRequests(webhookId: string): Promise<WebhookRequestsResponse>;

  // Variables
  getLocalVariables(fileKey: string): Promise<LocalVariablesResponse>;
  getPublishedVariables(fileKey: string): Promise<PublishedVariablesResponse>;
  postVariables(fileKey: string, payload: VariablesPayload): Promise<LocalVariablesResponse>;

  // Dev Resources
  getDevResources(fileKey: string, options?: GetDevResourcesOptions): Promise<DevResourcesResponse>;
  createDevResources(resources: DevResourceCreateInput[]): Promise<DevResourcesResponse>;
  updateDevResources(resources: DevResourceUpdateInput[]): Promise<DevResourcesResponse>;
  deleteDevResource(fileKey: string, devResourceId: string): Promise<void>;

  // Activity Logs
  getActivityLogs(options?: GetActivityLogsOptions): Promise<ActivityLogsResponse>;

  // Payments
  getPayments(options?: GetPaymentsOptions): Promise<PaymentsResponse>;

  // Library Analytics
  getComponentActions(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse>;
  getComponentUsages(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse>;
  getStyleActions(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse>;
  getStyleUsages(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse>;
}

// =============================================================================
// Options Types
// =============================================================================

export interface GetFileOptions {
  version?: string;
  ids?: string[];
  depth?: number;
  geometry?: 'paths';
  plugin_data?: string;
  branch_data?: boolean;
}

export interface GetFileNodesOptions {
  version?: string;
  depth?: number;
  geometry?: 'paths';
  plugin_data?: string;
}

export interface GetImagesOptions {
  scale?: number;
  format?: ImageFormat;
  svg_include_id?: boolean;
  svg_include_node_id?: boolean;
  svg_simplify_stroke?: boolean;
  contents_only?: boolean;
  use_absolute_bounds?: boolean;
  version?: string;
}

export interface GetCommentsOptions {
  as_md?: boolean;
}

export interface PostCommentOptions {
  comment_id?: string;
  client_meta?: {
    x?: number;
    y?: number;
    node_id?: string;
    node_offset?: { x: number; y: number };
  };
}

export interface GetProjectFilesOptions {
  branch_data?: boolean;
}

export interface PaginationOptions {
  page_size?: number;
  cursor?: string;
}

export interface GetWebhooksOptions {
  team_id?: string;
}

export interface CreateWebhookInput {
  event_type: string;
  team_id: string;
  endpoint: string;
  passcode: string;
  status?: 'ACTIVE' | 'PAUSED';
  description?: string;
}

export interface UpdateWebhookInput {
  event_type?: string;
  endpoint?: string;
  passcode?: string;
  status?: 'ACTIVE' | 'PAUSED';
  description?: string;
}

export interface VariablesPayload {
  variableCollections?: Array<{
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    id?: string;
    name?: string;
    initialModeId?: string;
  }>;
  variableModes?: Array<{
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    id?: string;
    variableCollectionId?: string;
    name?: string;
  }>;
  variables?: Array<{
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    id?: string;
    name?: string;
    variableCollectionId?: string;
    resolvedType?: string;
    description?: string;
    hiddenFromPublishing?: boolean;
    scopes?: string[];
    codeSyntax?: Record<string, string>;
  }>;
  variableModeValues?: Array<{
    variableId: string;
    modeId: string;
    value: unknown;
  }>;
}

export interface GetDevResourcesOptions {
  node_ids?: string[];
}

export interface GetActivityLogsOptions {
  event_type?: string;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface GetPaymentsOptions {
  user_ids?: string[];
}

export interface GetAnalyticsOptions {
  cursor?: string;
}

// =============================================================================
// Figma Client Implementation
// =============================================================================

class FigmaClientImpl implements FigmaClient {
  private credentials: TenantCredentials;
  private baseUrl: string;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
    this.baseUrl = credentials.baseUrl || FIGMA_API_BASE_URL;
  }

  // ===========================================================================
  // HTTP Request Helper
  // ===========================================================================

  private getAuthHeaders(): Record<string, string> {
    if (!this.credentials.accessToken) {
      throw new AuthenticationError(
        'No credentials provided. Include X-Figma-Token header with your Figma personal access token.'
      );
    }

    return {
      'X-Figma-Token': this.credentials.accessToken,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    // Handle authentication errors
    if (response.status === 401) {
      throw new AuthenticationError('Authentication failed. Check your Figma personal access token.');
    }

    // Handle forbidden
    if (response.status === 403) {
      throw new ForbiddenError('Access forbidden. You may not have permission to access this resource.');
    }

    // Handle not found
    if (response.status === 404) {
      throw new NotFoundError('Resource', endpoint);
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.text();
      let message = `API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.err || errorJson.error || message;
      } catch {
        // Use default message
      }
      throw new FigmaApiError(message, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string; user?: User }> {
    try {
      const user = await this.getMe();
      return { connected: true, message: 'Successfully connected to Figma API', user };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Files
  // ===========================================================================

  async getFile(fileKey: string, options?: GetFileOptions): Promise<FileResponse> {
    const params = new URLSearchParams();
    if (options?.version) params.set('version', options.version);
    if (options?.ids) params.set('ids', options.ids.join(','));
    if (options?.depth !== undefined) params.set('depth', String(options.depth));
    if (options?.geometry) params.set('geometry', options.geometry);
    if (options?.plugin_data) params.set('plugin_data', options.plugin_data);
    if (options?.branch_data) params.set('branch_data', 'true');

    const query = params.toString();
    return this.request<FileResponse>(`/v1/files/${fileKey}${query ? `?${query}` : ''}`);
  }

  async getFileNodes(fileKey: string, ids: string[], options?: GetFileNodesOptions): Promise<FileNodesResponse> {
    const params = new URLSearchParams();
    params.set('ids', ids.join(','));
    if (options?.version) params.set('version', options.version);
    if (options?.depth !== undefined) params.set('depth', String(options.depth));
    if (options?.geometry) params.set('geometry', options.geometry);
    if (options?.plugin_data) params.set('plugin_data', options.plugin_data);

    return this.request<FileNodesResponse>(`/v1/files/${fileKey}/nodes?${params.toString()}`);
  }

  async getFileMeta(fileKey: string): Promise<FileMetaResponse> {
    return this.request<FileMetaResponse>(`/v1/files/${fileKey}/meta`);
  }

  async getImages(fileKey: string, ids: string[], options?: GetImagesOptions): Promise<ImagesResponse> {
    const params = new URLSearchParams();
    params.set('ids', ids.join(','));
    if (options?.scale !== undefined) params.set('scale', String(options.scale));
    if (options?.format) params.set('format', options.format);
    if (options?.svg_include_id) params.set('svg_include_id', 'true');
    if (options?.svg_include_node_id) params.set('svg_include_node_id', 'true');
    if (options?.svg_simplify_stroke) params.set('svg_simplify_stroke', 'true');
    if (options?.contents_only) params.set('contents_only', 'true');
    if (options?.use_absolute_bounds) params.set('use_absolute_bounds', 'true');
    if (options?.version) params.set('version', options.version);

    return this.request<ImagesResponse>(`/v1/images/${fileKey}?${params.toString()}`);
  }

  async getImageFills(fileKey: string): Promise<ImageFillsResponse> {
    return this.request<ImageFillsResponse>(`/v1/files/${fileKey}/images`);
  }

  // ===========================================================================
  // Versions
  // ===========================================================================

  async getFileVersions(fileKey: string, options?: PaginationOptions): Promise<VersionsResponse> {
    const params = new URLSearchParams();
    if (options?.page_size) params.set('page_size', String(options.page_size));
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<VersionsResponse>(`/v1/files/${fileKey}/versions${query ? `?${query}` : ''}`);
  }

  // ===========================================================================
  // Comments
  // ===========================================================================

  async getComments(fileKey: string, options?: GetCommentsOptions): Promise<CommentsResponse> {
    const params = new URLSearchParams();
    if (options?.as_md) params.set('as_md', 'true');

    const query = params.toString();
    return this.request<CommentsResponse>(`/v1/files/${fileKey}/comments${query ? `?${query}` : ''}`);
  }

  async postComment(fileKey: string, message: string, options?: PostCommentOptions): Promise<PostCommentResponse> {
    return this.request<PostCommentResponse>(`/v1/files/${fileKey}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        comment_id: options?.comment_id,
        client_meta: options?.client_meta,
      }),
    });
  }

  async deleteComment(fileKey: string, commentId: string): Promise<void> {
    await this.request<void>(`/v1/files/${fileKey}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async getCommentReactions(fileKey: string, commentId: string, options?: PaginationOptions): Promise<CommentReactionsResponse> {
    const params = new URLSearchParams();
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<CommentReactionsResponse>(
      `/v1/files/${fileKey}/comments/${commentId}/reactions${query ? `?${query}` : ''}`
    );
  }

  async postCommentReaction(fileKey: string, commentId: string, emoji: string): Promise<void> {
    await this.request<void>(`/v1/files/${fileKey}/comments/${commentId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }

  async deleteCommentReaction(fileKey: string, commentId: string, emoji: string): Promise<void> {
    const params = new URLSearchParams();
    params.set('emoji', emoji);
    await this.request<void>(`/v1/files/${fileKey}/comments/${commentId}/reactions?${params.toString()}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Users
  // ===========================================================================

  async getMe(): Promise<User> {
    return this.request<User>('/v1/me');
  }

  // ===========================================================================
  // Teams & Projects
  // ===========================================================================

  async getTeamProjects(teamId: string): Promise<ProjectsResponse> {
    return this.request<ProjectsResponse>(`/v1/teams/${teamId}/projects`);
  }

  async getProjectFiles(projectId: string, options?: GetProjectFilesOptions): Promise<ProjectFilesResponse> {
    const params = new URLSearchParams();
    if (options?.branch_data) params.set('branch_data', 'true');

    const query = params.toString();
    return this.request<ProjectFilesResponse>(`/v1/projects/${projectId}/files${query ? `?${query}` : ''}`);
  }

  // ===========================================================================
  // Components
  // ===========================================================================

  async getTeamComponents(teamId: string, options?: PaginationOptions): Promise<ComponentsResponse> {
    const params = new URLSearchParams();
    if (options?.page_size) params.set('page_size', String(options.page_size));
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<ComponentsResponse>(`/v1/teams/${teamId}/components${query ? `?${query}` : ''}`);
  }

  async getFileComponents(fileKey: string): Promise<ComponentsResponse> {
    return this.request<ComponentsResponse>(`/v1/files/${fileKey}/components`);
  }

  async getComponent(componentKey: string): Promise<ComponentResponse> {
    return this.request<ComponentResponse>(`/v1/components/${componentKey}`);
  }

  // ===========================================================================
  // Component Sets
  // ===========================================================================

  async getTeamComponentSets(teamId: string, options?: PaginationOptions): Promise<ComponentSetsResponse> {
    const params = new URLSearchParams();
    if (options?.page_size) params.set('page_size', String(options.page_size));
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<ComponentSetsResponse>(`/v1/teams/${teamId}/component_sets${query ? `?${query}` : ''}`);
  }

  async getFileComponentSets(fileKey: string): Promise<ComponentSetsResponse> {
    return this.request<ComponentSetsResponse>(`/v1/files/${fileKey}/component_sets`);
  }

  async getComponentSet(componentSetKey: string): Promise<ComponentSetResponse> {
    return this.request<ComponentSetResponse>(`/v1/component_sets/${componentSetKey}`);
  }

  // ===========================================================================
  // Styles
  // ===========================================================================

  async getTeamStyles(teamId: string, options?: PaginationOptions): Promise<StylesResponse> {
    const params = new URLSearchParams();
    if (options?.page_size) params.set('page_size', String(options.page_size));
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<StylesResponse>(`/v1/teams/${teamId}/styles${query ? `?${query}` : ''}`);
  }

  async getFileStyles(fileKey: string): Promise<StylesResponse> {
    return this.request<StylesResponse>(`/v1/files/${fileKey}/styles`);
  }

  async getStyle(styleKey: string): Promise<StyleResponse> {
    return this.request<StyleResponse>(`/v1/styles/${styleKey}`);
  }

  // ===========================================================================
  // Webhooks
  // ===========================================================================

  async getWebhooks(options?: GetWebhooksOptions): Promise<WebhooksResponse> {
    const params = new URLSearchParams();
    if (options?.team_id) params.set('team_id', options.team_id);

    const query = params.toString();
    return this.request<WebhooksResponse>(`/v2/webhooks${query ? `?${query}` : ''}`);
  }

  async createWebhook(input: CreateWebhookInput): Promise<WebhookResponse> {
    return this.request<WebhookResponse>('/v2/webhooks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getWebhook(webhookId: string): Promise<WebhookResponse> {
    return this.request<WebhookResponse>(`/v2/webhooks/${webhookId}`);
  }

  async updateWebhook(webhookId: string, input: UpdateWebhookInput): Promise<WebhookResponse> {
    return this.request<WebhookResponse>(`/v2/webhooks/${webhookId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.request<void>(`/v2/webhooks/${webhookId}`, {
      method: 'DELETE',
    });
  }

  async getWebhookRequests(webhookId: string): Promise<WebhookRequestsResponse> {
    return this.request<WebhookRequestsResponse>(`/v2/webhooks/${webhookId}/requests`);
  }

  // ===========================================================================
  // Variables
  // ===========================================================================

  async getLocalVariables(fileKey: string): Promise<LocalVariablesResponse> {
    return this.request<LocalVariablesResponse>(`/v1/files/${fileKey}/variables/local`);
  }

  async getPublishedVariables(fileKey: string): Promise<PublishedVariablesResponse> {
    return this.request<PublishedVariablesResponse>(`/v1/files/${fileKey}/variables/published`);
  }

  async postVariables(fileKey: string, payload: VariablesPayload): Promise<LocalVariablesResponse> {
    return this.request<LocalVariablesResponse>(`/v1/files/${fileKey}/variables`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ===========================================================================
  // Dev Resources
  // ===========================================================================

  async getDevResources(fileKey: string, options?: GetDevResourcesOptions): Promise<DevResourcesResponse> {
    const params = new URLSearchParams();
    if (options?.node_ids) params.set('node_ids', options.node_ids.join(','));

    const query = params.toString();
    return this.request<DevResourcesResponse>(`/v1/files/${fileKey}/dev_resources${query ? `?${query}` : ''}`);
  }

  async createDevResources(resources: DevResourceCreateInput[]): Promise<DevResourcesResponse> {
    return this.request<DevResourcesResponse>('/v1/dev_resources', {
      method: 'POST',
      body: JSON.stringify({ dev_resources: resources }),
    });
  }

  async updateDevResources(resources: DevResourceUpdateInput[]): Promise<DevResourcesResponse> {
    return this.request<DevResourcesResponse>('/v1/dev_resources', {
      method: 'PUT',
      body: JSON.stringify({ dev_resources: resources }),
    });
  }

  async deleteDevResource(fileKey: string, devResourceId: string): Promise<void> {
    await this.request<void>(`/v1/files/${fileKey}/dev_resources/${devResourceId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Activity Logs
  // ===========================================================================

  async getActivityLogs(options?: GetActivityLogsOptions): Promise<ActivityLogsResponse> {
    const params = new URLSearchParams();
    if (options?.event_type) params.set('event_type', options.event_type);
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.order) params.set('order', options.order);

    const query = params.toString();
    return this.request<ActivityLogsResponse>(`/v1/activity_logs${query ? `?${query}` : ''}`);
  }

  // ===========================================================================
  // Payments
  // ===========================================================================

  async getPayments(options?: GetPaymentsOptions): Promise<PaymentsResponse> {
    const params = new URLSearchParams();
    if (options?.user_ids) params.set('user_ids', options.user_ids.join(','));

    const query = params.toString();
    return this.request<PaymentsResponse>(`/v1/payments${query ? `?${query}` : ''}`);
  }

  // ===========================================================================
  // Library Analytics
  // ===========================================================================

  async getComponentActions(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse> {
    const params = new URLSearchParams();
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<LibraryAnalyticsResponse>(
      `/v1/analytics/libraries/${fileKey}/component/actions${query ? `?${query}` : ''}`
    );
  }

  async getComponentUsages(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse> {
    const params = new URLSearchParams();
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<LibraryAnalyticsResponse>(
      `/v1/analytics/libraries/${fileKey}/component/usages${query ? `?${query}` : ''}`
    );
  }

  async getStyleActions(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse> {
    const params = new URLSearchParams();
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<LibraryAnalyticsResponse>(
      `/v1/analytics/libraries/${fileKey}/style/actions${query ? `?${query}` : ''}`
    );
  }

  async getStyleUsages(fileKey: string, options?: GetAnalyticsOptions): Promise<LibraryAnalyticsResponse> {
    const params = new URLSearchParams();
    if (options?.cursor) params.set('cursor', options.cursor);

    const query = params.toString();
    return this.request<LibraryAnalyticsResponse>(
      `/v1/analytics/libraries/${fileKey}/style/usages${query ? `?${query}` : ''}`
    );
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create a Figma client instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides its own credentials via headers,
 * allowing a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
export function createFigmaClient(credentials: TenantCredentials): FigmaClient {
  return new FigmaClientImpl(credentials);
}
