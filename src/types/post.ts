/**
 * Post Management Types
 * Defines all TypeScript interfaces and enums for the Post Management System
 */

// Enums
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

// Main Post Interface
export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;          // Image URL or base64
  categories: Category[];       // Multiple categories
  status: PostStatus;
  visibility: PostVisibility;
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
  publishedAt?: string;        // ISO 8601 timestamp (nullable)
  authorId: string;
  slug: string;
  viewCount: number;
  commentCount: number;
}

// Category Interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Form Request Types
export interface CreatePostRequest {
  title: string;
  description: string;
  content: string;
  thumbnail?: File | string;
  categoryIds: string[];
  publishedAt?: string;
  visibility: PostVisibility;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
  status?: PostStatus;
}

// API Response Types
export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
