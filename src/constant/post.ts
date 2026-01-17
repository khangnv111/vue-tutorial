/**
 * Post Management Constants
 */

import { PostStatus, PostVisibility } from '@/types/post'

// Status configuration with colors and labels
export const POST_STATUS_CONFIG = {
  [PostStatus.DRAFT]: {
    label: 'post.status.draft',
    status: 'warning',
    color: 'orange'
  },
  [PostStatus.PUBLISHED]: {
    label: 'post.status.published',
    status: 'success',
    color: 'green'
  },
  [PostStatus.ARCHIVED]: {
    label: 'post.status.archived',
    status: 'default',
    color: 'gray'
  }
}

// Visibility configuration
export const POST_VISIBILITY_CONFIG = {
  [PostVisibility.PUBLIC]: {
    label: 'post.visibility.public'
  },
  [PostVisibility.PRIVATE]: {
    label: 'post.visibility.private'
  }
}

// Status options for select dropdown
export const STATUS_OPTIONS = [
  { label: 'post.status.draft', value: PostStatus.DRAFT },
  { label: 'post.status.published', value: PostStatus.PUBLISHED },
  { label: 'post.status.archived', value: PostStatus.ARCHIVED }
]

// Visibility options for select dropdown
export const VISIBILITY_OPTIONS = [
  { label: 'post.visibility.public', value: PostVisibility.PUBLIC },
  { label: 'post.visibility.private', value: PostVisibility.PRIVATE }
]

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50]

// Form field constraints
export const FORM_CONSTRAINTS = {
  title: {
    minLength: 3,
    maxLength: 200
  },
  description: {
    minLength: 10,
    maxLength: 500
  },
  content: {
    minLength: 100
  }
}

// Image upload constraints
export const IMAGE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/gif']
}

// Date format
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
