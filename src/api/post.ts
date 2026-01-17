/**
 * Post Management API Service
 * Handles all API calls related to post management
 */

import type {
  Post,
  Category,
  CreatePostRequest,
  UpdatePostRequest,
  PostListResponse,
  ApiResponse
} from '@/types/post'
import {
  PostStatus,
  PostVisibility
} from '@/types/post'

// Simulated delay for network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Vue 3',
    description: 'Learn the basics of Vue 3 and how to build modern web applications with the latest features.',
    content: 'Vue 3 is a progressive JavaScript framework for building user interfaces. It is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects.\n\nKey features of Vue 3 include:\n\n1. Composition API - A new way to organize component logic\n2. Better TypeScript Support - Improved type inference\n3. Performance Improvements - Faster reactivity system\n4. Smaller Bundle Size - Better tree-shaking\n5. Teleport Component - Move DOM elements anywhere\n6. Fragments - Multiple root elements support',
    thumbnail: 'https://via.placeholder.com/300x200?text=Vue3',
    categories: [
      { id: '1', name: 'Technology', slug: 'technology' },
      { id: '2', name: 'Web Development', slug: 'web-development' }
    ],
    status: PostStatus.PUBLISHED,
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-15T10:30:00Z',
    authorId: 'user1',
    slug: 'getting-started-vue-3',
    viewCount: 1250,
    commentCount: 23
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    description: 'Master TypeScript with these essential best practices and tips.',
    content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing to the language, which can help catch errors early and improve code quality.\n\nBest practices include:\n1. Use strict mode\n2. Proper type annotations\n3. Avoid using any\n4. Use interfaces and types properly\n5. Leverage type guards',
    thumbnail: 'https://via.placeholder.com/300x200?text=TypeScript',
    categories: [
      { id: '1', name: 'Technology', slug: 'technology' },
      { id: '3', name: 'Programming', slug: 'programming' }
    ],
    status: PostStatus.PUBLISHED,
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    publishedAt: '2024-01-14T09:15:00Z',
    authorId: 'user1',
    slug: 'typescript-best-practices',
    viewCount: 890,
    commentCount: 15
  },
  {
    id: '3',
    title: 'Ant Design Vue 4 Components Overview',
    description: 'Comprehensive guide to using Ant Design Vue 4 components in your projects.',
    content: 'Ant Design Vue is a high-quality UI library based on Ant Design and Vue.js. It provides a series of enterprise-level UI components and design tokens.\n\nKey components include:\n- Layout (Grid, Flex)\n- Navigation (Menu, Breadcrumb, Dropdown)\n- Form (Form, Input, Select, DatePicker)\n- Data Display (Table, List, Tree, Card)\n- Feedback (Modal, Message, Notification)',
    thumbnail: 'https://via.placeholder.com/300x200?text=AntDesign',
    categories: [
      { id: '1', name: 'Technology', slug: 'technology' },
      { id: '2', name: 'Web Development', slug: 'web-development' }
    ],
    status: PostStatus.DRAFT,
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-01-13T14:45:00Z',
    updatedAt: '2024-01-16T11:20:00Z',
    publishedAt: undefined,
    authorId: 'user2',
    slug: 'ant-design-vue-components',
    viewCount: 320,
    commentCount: 8
  },
  {
    id: '4',
    title: 'Building Real-Time Applications with WebSockets',
    description: 'Learn how to build real-time features using WebSocket technology.',
    content: 'WebSockets provide a way to establish a persistent, bidirectional communication channel over a single TCP connection. Unlike HTTP, which is request-response based, WebSockets allow the server to push data to clients whenever new data is available.\n\nApplications:\n- Real-time chat applications\n- Live notifications\n- Collaborative tools\n- Live dashboards',
    thumbnail: 'https://via.placeholder.com/300x200?text=WebSockets',
    categories: [
      { id: '1', name: 'Technology', slug: 'technology' },
      { id: '3', name: 'Programming', slug: 'programming' }
    ],
    status: PostStatus.ARCHIVED,
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    publishedAt: '2024-01-10T08:00:00Z',
    authorId: 'user1',
    slug: 'real-time-websockets',
    viewCount: 2100,
    commentCount: 45
  }
]

const mockCategories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Technology related posts' },
  { id: '2', name: 'Web Development', slug: 'web-development', description: 'Web development tutorials and tips' },
  { id: '3', name: 'Programming', slug: 'programming', description: 'Programming concepts and best practices' },
  { id: '4', name: 'Business', slug: 'business', description: 'Business and startup insights' },
  { id: '5', name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle and personal development' },
  { id: '6', name: 'Travel', slug: 'travel', description: 'Travel guides and experiences' }
]

/**
 * Get paginated list of posts with filters
 */
export async function getPostList(params: {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: PostStatus | string;
  dateRange?: [string, string];
}): Promise<ApiResponse<PostListResponse>> {
  await delay(500) // Simulate network delay

  let filtered = [...mockPosts]

  // Apply filters
  if (params.title && params.title.trim()) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(params.title!.toLowerCase())
    )
  }

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(p => p.status === params.status)
  }

  if (params.dateRange && params.dateRange.length === 2) {
    const [startDate, endDate] = params.dateRange
    filtered = filtered.filter(p => {
      const postDate = new Date(p.createdAt).getTime()
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()
      return postDate >= start && postDate <= end
    })
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    success: true,
    data: {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      pageSize
    }
  }
}

/**
 * Get single post by ID
 */
export async function getPostById(id: string): Promise<ApiResponse<Post>> {
  await delay(300)

  const post = mockPosts.find(p => p.id === id)

  if (!post) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  return {
    success: true,
    data: post
  }
}

/**
 * Create new post
 */
export async function createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
  await delay(800)

  const newPost: Post = {
    id: String(mockPosts.length + 1),
    title: data.title,
    description: data.description,
    content: data.content,
    thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : 'https://via.placeholder.com/300x200?text=Post',
    categories: mockCategories.filter(c => data.categoryIds.includes(c.id)),
    status: PostStatus.DRAFT,
    visibility: data.visibility,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: data.publishedAt,
    authorId: 'current-user',
    slug: data.title.toLowerCase().replace(/\s+/g, '-'),
    viewCount: 0,
    commentCount: 0
  }

  mockPosts.push(newPost)

  return {
    success: true,
    data: newPost,
    message: 'Post created successfully'
  }
}

/**
 * Update existing post
 */
export async function updatePost(id: string, data: UpdatePostRequest): Promise<ApiResponse<Post>> {
  await delay(800)

  const index = mockPosts.findIndex(p => p.id === id)

  if (index === -1) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  const currentPost = mockPosts[index]

  const updatedPost: Post = {
    ...currentPost,
    title: data.title,
    description: data.description,
    content: data.content,
    thumbnail: typeof data.thumbnail === 'string' ? data.thumbnail : (currentPost?.thumbnail || undefined),
    categories: mockCategories.filter(c => data.categoryIds.includes(c.id)),
    visibility: data.visibility,
    publishedAt: data.publishedAt || currentPost?.publishedAt,
    updatedAt: new Date().toISOString(),
    status: data.status || currentPost?.status,
    id: currentPost.id,
    createdAt: currentPost.createdAt,
    authorId: currentPost.authorId,
    slug: currentPost.slug,
    viewCount: currentPost.viewCount,
    commentCount: currentPost.commentCount
  }

  mockPosts[index] = updatedPost

  return {
    success: true,
    data: updatedPost,
    message: 'Post updated successfully'
  }
}

/**
 * Delete single post
 */
export async function deletePost(id: string): Promise<ApiResponse<void>> {
  await delay(400)

  const index = mockPosts.findIndex(p => p.id === id)

  if (index === -1) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  mockPosts.splice(index, 1)

  return {
    success: true,
    message: 'Post deleted successfully'
  }
}

/**
 * Bulk delete posts
 */
export async function deletePostsBulk(ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
  await delay(600)

  let deleted = 0

  for (const id of ids) {
    const index = mockPosts.findIndex(p => p.id === id)
    if (index !== -1) {
      mockPosts.splice(index, 1)
      deleted++
    }
  }

  return {
    success: true,
    data: { deleted },
    message: `${deleted} posts deleted successfully`
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  await delay(200)

  return {
    success: true,
    data: mockCategories
  }
}

/**
 * Publish post
 */
export async function publishPost(id: string): Promise<ApiResponse<Post>> {
  await delay(400)

  const index = mockPosts.findIndex(p => p.id === id)

  if (index === -1) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  const post = mockPosts[index]
  post.status = PostStatus.PUBLISHED
  post.publishedAt = new Date().toISOString()
  post.updatedAt = new Date().toISOString()

  return {
    success: true,
    data: post,
    message: 'Post published successfully'
  }
}

/**
 * Archive post
 */
export async function archivePost(id: string): Promise<ApiResponse<Post>> {
  await delay(400)

  const index = mockPosts.findIndex(p => p.id === id)

  if (index === -1) {
    return {
      success: false,
      error: 'Post not found'
    }
  }

  const post = mockPosts[index]
  post.status = PostStatus.ARCHIVED
  post.updatedAt = new Date().toISOString()

  return {
    success: true,
    data: post,
    message: 'Post archived successfully'
  }
}
