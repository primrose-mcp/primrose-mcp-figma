/**
 * Figma API Entity Types
 *
 * Type definitions for Figma API responses and data structures.
 */

// =============================================================================
// Common Types
// =============================================================================

export interface User {
  id: string;
  handle: string;
  img_url: string;
  email?: string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// =============================================================================
// File Types
// =============================================================================

export interface FileResponse {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: DocumentNode;
  components: Record<string, Component>;
  componentSets: Record<string, ComponentSet>;
  schemaVersion: number;
  styles: Record<string, Style>;
  mainFileKey?: string;
  branches?: Branch[];
}

export interface FileMetaResponse {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
}

export interface DocumentNode {
  id: string;
  name: string;
  type: string;
  children?: Node[];
}

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  visible?: boolean;
  locked?: boolean;
  children?: Node[];
  backgroundColor?: Color;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  absoluteBoundingBox?: Rectangle;
  constraints?: Constraints;
  characters?: string;
  style?: TypeStyle;
  componentId?: string;
  [key: string]: unknown;
}

export type NodeType =
  | 'DOCUMENT'
  | 'CANVAS'
  | 'FRAME'
  | 'GROUP'
  | 'VECTOR'
  | 'BOOLEAN_OPERATION'
  | 'STAR'
  | 'LINE'
  | 'ELLIPSE'
  | 'REGULAR_POLYGON'
  | 'RECTANGLE'
  | 'TEXT'
  | 'SLICE'
  | 'COMPONENT'
  | 'COMPONENT_SET'
  | 'INSTANCE'
  | 'STICKY'
  | 'SHAPE_WITH_TEXT'
  | 'CONNECTOR'
  | 'SECTION'
  | 'TABLE'
  | 'TABLE_CELL'
  | 'WIDGET'
  | 'EMBED'
  | 'LINK_UNFURL'
  | 'MEDIA'
  | 'WASHI_TAPE';

export interface Paint {
  type: PaintType;
  visible?: boolean;
  opacity?: number;
  color?: Color;
  blendMode?: BlendMode;
  gradientHandlePositions?: Vector[];
  gradientStops?: ColorStop[];
  scaleMode?: string;
  imageTransform?: number[][];
  imageRef?: string;
}

export type PaintType = 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI' | 'VIDEO';

export type BlendMode =
  | 'PASS_THROUGH'
  | 'NORMAL'
  | 'DARKEN'
  | 'MULTIPLY'
  | 'LINEAR_BURN'
  | 'COLOR_BURN'
  | 'LIGHTEN'
  | 'SCREEN'
  | 'LINEAR_DODGE'
  | 'COLOR_DODGE'
  | 'OVERLAY'
  | 'SOFT_LIGHT'
  | 'HARD_LIGHT'
  | 'DIFFERENCE'
  | 'EXCLUSION'
  | 'HUE'
  | 'SATURATION'
  | 'COLOR'
  | 'LUMINOSITY';

export interface ColorStop {
  position: number;
  color: Color;
}

export interface Constraints {
  vertical: ConstraintType;
  horizontal: ConstraintType;
}

export type ConstraintType = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'CENTER' | 'TOP_BOTTOM' | 'LEFT_RIGHT' | 'SCALE';

export interface TypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  fontWeight: number;
  fontSize: number;
  textAlignHorizontal?: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  letterSpacing: number;
  lineHeightPx: number;
  lineHeightPercent?: number;
  lineHeightUnit?: 'PIXELS' | 'FONT_SIZE_%' | 'INTRINSIC_%';
}

// =============================================================================
// File Nodes Response
// =============================================================================

export interface FileNodesResponse {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  nodes: Record<string, { document: Node; components: Record<string, Component>; styles: Record<string, Style> }>;
}

// =============================================================================
// Images
// =============================================================================

export interface ImagesResponse {
  err: string | null;
  images: Record<string, string | null>;
}

export interface ImageFillsResponse {
  err: string | null;
  meta: {
    images: Record<string, string>;
  };
}

export type ImageFormat = 'jpg' | 'png' | 'svg' | 'pdf';

// =============================================================================
// Versions
// =============================================================================

export interface Version {
  id: string;
  created_at: string;
  label: string | null;
  description: string | null;
  user: User;
  thumbnail_url?: string;
}

export interface VersionsResponse {
  versions: Version[];
  pagination: {
    prev_page?: string;
    next_page?: string;
  };
}

// =============================================================================
// Comments
// =============================================================================

export interface Comment {
  id: string;
  uuid?: string;
  file_key: string;
  parent_id: string | null;
  user: User;
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta: {
    x?: number;
    y?: number;
    node_id?: string;
    node_offset?: Vector;
  } | null;
  order_id: string;
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  user: User;
  emoji: string;
  created_at: string;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface PostCommentResponse {
  id: string;
  uuid: string;
  client_meta: {
    x?: number;
    y?: number;
    node_id?: string;
    node_offset?: Vector;
  } | null;
  message: string;
  file_key: string;
  parent_id: string | null;
  user: User;
  created_at: string;
  resolved_at: string | null;
  order_id: string;
}

export interface CommentReactionsResponse {
  reactions: CommentReaction[];
  pagination: {
    prev_page?: string;
    next_page?: string;
  };
}

// =============================================================================
// Projects & Teams
// =============================================================================

export interface Project {
  id: string;
  name: string;
}

export interface ProjectsResponse {
  name: string;
  projects: Project[];
}

export interface ProjectFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

export interface ProjectFilesResponse {
  name: string;
  files: ProjectFile[];
}

// =============================================================================
// Components
// =============================================================================

export interface Component {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
  documentationLinks?: DocumentationLink[];
}

export interface ComponentMetadata {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  containing_frame?: FrameInfo;
  user: User;
}

export interface ComponentResponse {
  meta: ComponentMetadata;
}

export interface ComponentsResponse {
  meta: {
    components: ComponentMetadata[];
    cursor?: {
      before?: number;
      after?: number;
    };
  };
}

// =============================================================================
// Component Sets
// =============================================================================

export interface ComponentSet {
  key: string;
  name: string;
  description: string;
  documentationLinks?: DocumentationLink[];
}

export interface ComponentSetMetadata {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  containing_frame?: FrameInfo;
  user: User;
}

export interface ComponentSetResponse {
  meta: ComponentSetMetadata;
}

export interface ComponentSetsResponse {
  meta: {
    component_sets: ComponentSetMetadata[];
    cursor?: {
      before?: number;
      after?: number;
    };
  };
}

// =============================================================================
// Styles
// =============================================================================

export interface Style {
  key: string;
  name: string;
  description: string;
  remote: boolean;
  styleType: StyleType;
}

export type StyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

export interface StyleMetadata {
  key: string;
  file_key: string;
  node_id: string;
  style_type: StyleType;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
  sort_position: string;
}

export interface StyleResponse {
  meta: StyleMetadata;
}

export interface StylesResponse {
  meta: {
    styles: StyleMetadata[];
    cursor?: {
      before?: number;
      after?: number;
    };
  };
}

// =============================================================================
// Webhooks
// =============================================================================

export interface Webhook {
  id: string;
  event_type: WebhookEventType;
  team_id: string;
  status: 'ACTIVE' | 'PAUSED';
  client_id: string | null;
  passcode: string;
  endpoint: string;
  description: string | null;
}

export type WebhookEventType =
  | 'PING'
  | 'FILE_UPDATE'
  | 'FILE_VERSION_UPDATE'
  | 'FILE_DELETE'
  | 'FILE_COMMENT'
  | 'LIBRARY_PUBLISH';

export interface WebhookResponse {
  id: string;
  event_type: WebhookEventType;
  team_id: string;
  status: 'ACTIVE' | 'PAUSED';
  client_id: string | null;
  passcode: string;
  endpoint: string;
  description: string | null;
}

export interface WebhooksResponse {
  webhooks: Webhook[];
}

export interface WebhookRequest {
  request_id: string;
  endpoint: string;
  payload: Record<string, unknown>;
  timestamp: string;
  response_status_code: number | null;
  error_reason: string | null;
}

export interface WebhookRequestsResponse {
  requests: WebhookRequest[];
}

// =============================================================================
// Variables
// =============================================================================

export interface Variable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: VariableResolvedType;
  valuesByMode: Record<string, VariableValue>;
  remote: boolean;
  description: string;
  hiddenFromPublishing: boolean;
  scopes: VariableScope[];
  codeSyntax?: Record<string, string>;
}

export type VariableResolvedType = 'BOOLEAN' | 'FLOAT' | 'STRING' | 'COLOR';

export type VariableValue = boolean | number | string | Color | VariableAlias;

export interface VariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type VariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'STROKE_FLOAT'
  | 'EFFECT_FLOAT'
  | 'EFFECT_COLOR'
  | 'OPACITY'
  | 'FONT_FAMILY'
  | 'FONT_STYLE'
  | 'FONT_WEIGHT'
  | 'FONT_SIZE'
  | 'LINE_HEIGHT'
  | 'LETTER_SPACING'
  | 'PARAGRAPH_SPACING'
  | 'PARAGRAPH_INDENT';

export interface VariableCollection {
  id: string;
  name: string;
  key: string;
  modes: VariableMode[];
  defaultModeId: string;
  remote: boolean;
  hiddenFromPublishing: boolean;
}

export interface VariableMode {
  modeId: string;
  name: string;
}

export interface LocalVariablesResponse {
  meta: {
    variables: Record<string, Variable>;
    variableCollections: Record<string, VariableCollection>;
  };
}

export interface PublishedVariablesResponse {
  meta: {
    variables: Record<string, Variable>;
    variableCollections: Record<string, VariableCollection>;
  };
}

// =============================================================================
// Dev Resources
// =============================================================================

export interface DevResource {
  id: string;
  name: string;
  url: string;
  file_key: string;
  node_id: string;
}

export interface DevResourcesResponse {
  dev_resources: DevResource[];
}

export interface DevResourceCreateInput {
  name: string;
  url: string;
  file_key: string;
  node_id: string;
}

export interface DevResourceUpdateInput {
  id: string;
  name?: string;
  url?: string;
}

// =============================================================================
// Activity Logs
// =============================================================================

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    type: string;
  };
  event_type: string;
  entity: {
    id: string;
    name: string;
    type: string;
  };
  context: {
    ip_address?: string;
    client_name?: string;
  };
}

export interface ActivityLogsResponse {
  activity_logs: ActivityLog[];
  cursor?: string;
}

// =============================================================================
// Payments
// =============================================================================

export interface PaymentInfo {
  users: PaymentUser[];
}

export interface PaymentUser {
  user_id: string;
  payment_status: 'PAID' | 'FREE' | 'UNPAID';
}

export interface PaymentsResponse {
  payment_information: PaymentInfo;
}

// =============================================================================
// Library Analytics
// =============================================================================

export interface ComponentAction {
  component_key: string;
  component_name: string;
  action_type: 'INSERT' | 'DETACH';
  count: number;
}

export interface ComponentUsage {
  component_key: string;
  component_name: string;
  file_count: number;
  instance_count: number;
}

export interface StyleAction {
  style_key: string;
  style_name: string;
  action_type: 'INSERT' | 'DETACH';
  count: number;
}

export interface StyleUsage {
  style_key: string;
  style_name: string;
  file_count: number;
  usage_count: number;
}

export interface LibraryAnalyticsResponse {
  rows: ComponentAction[] | ComponentUsage[] | StyleAction[] | StyleUsage[];
  cursor?: string;
  next_page?: string;
}

// =============================================================================
// Common
// =============================================================================

export interface FrameInfo {
  pageId: string;
  pageName: string;
  nodeId: string;
  name: string;
  backgroundColor?: Color;
}

export interface DocumentationLink {
  uri: string;
}

export interface Branch {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  link_access: string;
}

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  /** Number of items per page */
  page_size?: number;
  /** Cursor for pagination */
  cursor?: string;
}

export interface CursorPagination {
  before?: number;
  after?: number;
}
