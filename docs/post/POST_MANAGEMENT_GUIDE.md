# Post Management System - Complete Guide

## Overview

The Post Management System is a comprehensive module designed to enable administrators and content creators to manage blog posts efficiently. It provides functionalities for listing, searching, creating, editing, and deleting posts with support for multiple categories, publishing schedules, and detailed post management features.

**Language Support**: English (en-US) and Vietnamese (vi-VN)

---

## Table of Contents

1. [Features Overview](#features-overview)
2. [File Structure](#file-structure)
3. [Component Architecture](#component-architecture)
4. [Route Configuration](#route-configuration)
5. [Data Models](#data-models)
6. [Post List Page](#post-list-page)
7. [Post Detail Page](#post-detail-page)
8. [Post Create/Edit Page](#post-createedit-page)
9. [API Endpoints](#api-endpoints)
10. [Internationalization](#internationalization)
11. [Implementation Steps](#implementation-steps)
12. [Testing Guide](#testing-guide)
13. [Future Enhancements](#future-enhancements)

---

## Features Overview

### 1. Post List Page (`/post/list`)

**Purpose**: Display all posts with search, filter, and bulk management capabilities.

#### Key Features:

- **Search Functionality**:
  - Search by post title
  - Filter by creation date range
  - Filter by post status (Draft, Published, Archived)
  - Advanced search toggle for additional filters
  
- **Data Table Display**:
  - **Checkbox Column**: Select multiple posts for bulk operations
  - **Title Column**: Display post title (clickable for detail view)
  - **Status Column**: Display status with color-coded badges
    - Draft: Orange/Warning badge
    - Published: Green/Success badge
    - Archived: Gray/Default badge
  - **Created Time Column**: Display post creation timestamp
  - **Updated Time Column**: Display last modification timestamp
  - **Published Time Column**: Display when post was published (if applicable)
  - **Actions Column**: 
    - Detail button: View full post details
    - Edit button: Modify post content and metadata
    - Delete button: Remove single post

- **Action Buttons**:
  - **"New Post" Button**: Navigate to post creation page
  - **"Bulk Delete" Button**: Delete all selected posts (appears when rows are selected)
  
- **Pagination**: 
  - Configurable page size (default: 10, 20, 50)
  - Display total count of posts
  - Navigate between pages

#### UI Components:
- Ant Design Vue Form (`a-form`, `a-form-item`)
- Ant Design Vue Input (`a-input`)
- Ant Design Vue DatePicker (`a-range-picker`)
- Ant Design Vue Select (`a-select`)
- Ant Design Vue Table (`a-table` with row selection)
- Ant Design Vue Button (`a-button`)
- Ant Design Vue Card (`a-card`)

#### State Management:
```typescript
// Search/Filter State
queryParam: {
  title: string;          // Search by title
  status: string;         // Filter by status
  dateRange: [Dayjs, Dayjs]; // Creation date range
}

// Table State
pagination: {
  current: number;        // Current page
  pageSize: number;       // Items per page
  total: number;          // Total items
}

selectedRowKeys: any[];   // Selected post IDs for bulk operations
dataSource: Post[];       // Table data
loading: boolean;         // Loading state indicator
```

#### Actions:
- **fetchData()**: Load posts from API with current filters and pagination
- **handleTableChange()**: Handle pagination changes
- **handleSearch()**: Execute search with filters
- **handleReset()**: Clear all filters and reset search
- **handleAdd()**: Navigate to create post page
- **handleBulkDelete()**: Delete all selected posts with confirmation
- **handleDetail(record)**: View post details
- **handleEdit(record)**: Navigate to edit post page
- **handleDelete(record)**: Delete single post with confirmation

#### Localization Keys:
```
menu.post.list          - Page title
table.title            - Column header
table.status           - Column header
table.createdAt        - Column header
table.updatedAt        - Column header
table.publishedAt      - Column header
table.action           - Column header
button.new             - New Post button
button.bulkDelete      - Bulk Delete button
button.search          - Search button
button.reset           - Reset button
placeholder.title      - Search input placeholder
status.draft           - Draft status label
status.published       - Published status label
status.archived        - Archived status label
```

---

### 2. Post Detail Page (`/post/:id/detail`)

**Purpose**: Display complete post information in read-only format.

#### Key Features:

- **Post Information Display**:
  - Title
  - Thumbnail image
  - Description
  - Category list
  - Creation time
  - Last updated time
  - Published time (if applicable)
  - Current status

- **Post Content Display**:
  - Full post body with formatting preserved
  - Responsive text rendering

- **Navigation**:
  - Back button to return to list page
  - Edit button to modify post
  - Delete button with confirmation

#### UI Components:
- Ant Design Vue Descriptions (`a-descriptions`, `a-descriptions-item`)
- Ant Design Vue Image (`a-image`)
- Ant Design Vue Tag (`a-tag`)
- Ant Design Vue Button (`a-button`)
- Ant Design Vue Card (`a-card`)
- Ant Design Vue Divider (`a-divider`)
- Ant Design Vue Modal (for delete confirmation)

#### State:
```typescript
post: Post;              // Post data
loading: boolean;        // Loading state
```

#### Actions:
- **loadPost(id)**: Fetch post details from API
- **handleEdit()**: Navigate to edit page
- **handleDelete()**: Delete post with confirmation
- **handleBack()**: Return to list page

#### Localization Keys:
```
menu.post.detail        - Page title
label.title            - Post title
label.description      - Post description
label.content          - Post content
label.category         - Categories
label.thumbnail        - Thumbnail image
label.status           - Status
label.createdAt        - Created date
label.updatedAt        - Updated date
label.publishedAt      - Published date
button.edit            - Edit button
button.delete          - Delete button
button.back            - Back button
message.deleteConfirm  - Delete confirmation message
```

---

### 3. Post Create/Edit Page (`/post/create` and `/post/:id/edit`)

**Purpose**: Provide form interface for creating and editing posts.

#### Key Features:

- **Form Fields**:
  1. **Title Field**:
     - Type: Text Input
     - Required: Yes
     - Max length: 200 characters
     - Real-time character count
     
  2. **Thumbnail Image Field**:
     - Type: File Upload
     - Accepted formats: JPG, PNG, GIF
     - Max size: 5MB
     - Preview: Display uploaded image preview
     - Drag and drop supported
     
  3. **Description Field**:
     - Type: Text Area
     - Required: Yes
     - Max length: 500 characters
     - Real-time character count
     - Placeholder: "Brief description of the post"
     
  4. **Category Field**:
     - Type: Multi-select Dropdown
     - Required: Yes
     - Multiple selections allowed
     - Options loaded from categories API
     - Example categories: Technology, Lifestyle, Business, Travel, etc.
     
  5. **Publish Time Field**:
     - Type: Date/Time Picker
     - Required: No (defaults to current time)
     - Can schedule posts for future publishing
     - Shows timezone indication
     
  6. **Post Content Field**:
     - Type: Rich Text Editor or Text Area
     - Required: Yes
     - Supports: Text, formatting (bold, italic, underline)
     - Minimum length: 100 characters
     - Character count display

- **Form Validation**:
  - Real-time validation feedback
  - Required field indicators
  - Error messages displayed below fields
  - Submit button disabled until all required fields are valid

- **Form Actions**:
  - **Save Button**: Save post and return to list
  - **Save & Publish Button**: Save and immediately publish post
  - **Cancel Button**: Discard changes and return to list
  - **Save as Draft Button**: Save without publishing

- **Edit Mode**:
  - Pre-populate form with existing post data
  - Display post creation time (read-only)
  - Track which fields have been modified
  - Show last saved timestamp

#### UI Components:
- Ant Design Vue Form (`a-form`, `a-form-item`)
- Ant Design Vue Input (`a-input`, `a-input-number`)
- Ant Design Vue TextArea (`a-textarea`)
- Ant Design Vue Upload (`a-upload`)
- Ant Design Vue Select (`a-select` with `mode="multiple"`)
- Ant Design Vue DatePicker (`a-date-picker`)
- Ant Design Vue Button (`a-button`)
- Ant Design Vue Card (`a-card`)
- Ant Design Vue Alert (for info/warning messages)

#### State:
```typescript
form: FormInstance;      // Form instance
post: Post;              // Post data being edited
isEdit: boolean;         // Create vs Edit mode flag
loading: boolean;        // Loading state
submitting: boolean;     // Form submission state
categories: Category[];  // Available categories
imagePreview: string;    // Thumbnail preview URL
unsavedChanges: boolean; // Track unsaved changes
```

#### Actions:
- **loadPost(id)**: Load existing post for editing
- **loadCategories()**: Fetch available categories
- **validateForm()**: Validate all form fields
- **handleImageUpload(file)**: Process image upload
- **handleSubmit()**: Save post and return to list
- **handleSaveAndPublish()**: Save and set status to published
- **handleSaveDraft()**: Save with draft status
- **handleCancel()**: Return without saving with unsaved changes warning
- **resetForm()**: Clear all form fields

#### Localization Keys:
```
menu.post.create        - Create page title
menu.post.edit          - Edit page title
label.title             - Title label
label.thumbnail         - Thumbnail label
label.description       - Description label
label.category          - Category label
label.publishTime       - Publish time label
label.content           - Content label
placeholder.title       - Title placeholder
placeholder.description - Description placeholder
placeholder.content     - Content placeholder
button.save             - Save button
button.publish          - Publish button
button.draft            - Save as Draft button
button.cancel           - Cancel button
validation.required     - Required field error
validation.minLength    - Minimum length error
validation.maxLength    - Maximum length error
message.unsavedChanges  - Unsaved changes warning
```

---

## File Structure

```
src/
├── api/
│   └── post.ts                    # Post API service
├── types/
│   └── post.ts                    # TypeScript interfaces and types
├── constant/
│   ├── index.ts                   # Update with post constants
│   └── post.ts                    # Post-specific constants
├── views/
│   └── post/
│       ├── List.vue               # Post list page
│       ├── Detail.vue             # Post detail page
│       └── CreateEdit.vue         # Create/Edit post page
├── locales/
│   └── lang/
│       ├── en-Us.ts               # Update with post labels
│       ├── vi-VN.ts               # Update with post labels
│       └── form/
│           ├── en.ts              # Add form field labels
│           └── vi.ts              # Add form field labels
└── router/
    └── route.config.ts            # Add post routes

docs/
└── POST_MANAGEMENT_GUIDE.md       # This file
```

---

## Component Architecture

### Directory Structure:
```
src/views/post/
├── List.vue                       # Main list component
├── Detail.vue                     # Detail view component
└── CreateEdit.vue                 # Form component for create/edit
```

### Component Relationships:

```
BasicLayout (Main Layout)
└── Post Routes
    ├── List.vue
    │   ├── Search Form
    │   ├── Toolbar (New, Bulk Delete buttons)
    │   └── Data Table
    │       ├── Detail Modal/View
    │       ├── Delete Confirmation
    │       └── Row Selection
    │
    ├── Detail.vue
    │   ├── Post Information Display
    │   ├── Content Display
    │   └── Action Buttons
    │
    └── CreateEdit.vue
        ├── Form Container
        ├── Form Fields
        ├── Image Upload
        ├── Category Selection
        ├── Date/Time Picker
        ├── Rich Text Editor
        └── Action Buttons
```

---

## Route Configuration

### Routes to Add to `src/router/route.config.ts`:

```typescript
{
    path: '/post',
    name: 'post',
    meta: { title: 'menu.post', icon: 'file-text' },
    children: [
        {
            path: '/post/list',
            name: 'PostList',
            component: () => import('@/views/post/List.vue'),
            meta: { title: 'menu.post.list' }
        },
        {
            path: '/post/create',
            name: 'PostCreate',
            component: () => import('@/views/post/CreateEdit.vue'),
            meta: { title: 'menu.post.create' }
        },
        {
            path: '/post/:id/detail',
            name: 'PostDetail',
            component: () => import('@/views/post/Detail.vue'),
            meta: { title: 'menu.post.detail' }
        },
        {
            path: '/post/:id/edit',
            name: 'PostEdit',
            component: () => import('@/views/post/CreateEdit.vue'),
            meta: { title: 'menu.post.edit' }
        }
    ]
}
```

---

## Data Models

### TypeScript Interfaces (`src/types/post.ts`):

```typescript
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
```

---

## Post List Page

### File: `src/views/post/List.vue`

### Features Implementation:

#### 1. Search and Filter Form:
- Text input for title search
- Date range picker for creation date filtering
- Status dropdown (All, Draft, Published, Archived)
- Search/Reset buttons
- Advanced filter toggle (optional)

#### 2. Table Display:
- Columns: Checkbox, Title, Status, Created, Updated, Published, Actions
- Row hover effects
- Pagination at bottom
- Loading indicator during data fetch

#### 3. Bulk Operations:
- Selected row count display
- Bulk delete confirmation modal
- Success/error notifications

#### 4. Individual Actions:
- View detail: Navigates to `/post/:id/detail`
- Edit: Navigates to `/post/:id/edit`
- Delete: Shows confirmation modal

### Key Methods:

```typescript
// Data Fetching
fetchData(page = 1): Promise<void>

// Search/Filter
handleSearch(): void
handleReset(): void
toggleAdvanced(): void

// Bulk Operations
handleBulkDelete(): void
confirmBulkDelete(): void

// Row Operations
handleDetail(record: Post): void
handleEdit(record: Post): void
handleDelete(record: Post): void
confirmDelete(id: string): void

// Table Management
handleTableChange(pagination: PaginationConfig): void
handleSelectChange(selectedKeys: string[]): void
```

### Computed Properties:

```typescript
// Format status for display
statusLabel(status: PostStatus): string

// Format dates to readable format
formatDate(date: string): string

// Check if bulk delete button should be enabled
canBulkDelete: boolean

// Get selected posts count
selectedCount: number
```

---

## Post Detail Page

### File: `src/views/post/Detail.vue`

### Features Implementation:

#### 1. Post Information Display:
- Title (large heading)
- Thumbnail image (with lightbox on click)
- Basic metadata (Author, Created, Updated, Published dates)
- Status badge
- Categories tags

#### 2. Post Content Display:
- Full post body with preserved formatting
- Responsive layout

#### 3. Action Buttons:
- Back button (top-left or breadcrumb)
- Edit button
- Delete button with confirmation

### Key Methods:

```typescript
// Load post details
loadPost(postId: string): Promise<void>

// Navigation
goBack(): void
goToEdit(postId: string): void

// Delete operation
handleDelete(): void
confirmDelete(): void

// Format utilities
formatDate(date: string): string
```

---

## Post Create/Edit Page

### File: `src/views/post/CreateEdit.vue`

### Form Structure:

```typescript
interface PostFormData {
  title: string;
  description: string;
  content: string;
  thumbnail?: File | string;
  categoryIds: string[];
  publishedAt?: Dayjs;
  visibility: PostVisibility;
}
```

### Form Validation Rules:

```typescript
const rules = {
  title: [
    { required: true, message: 'Title is required' },
    { min: 3, message: 'Minimum 3 characters' },
    { max: 200, message: 'Maximum 200 characters' }
  ],
  description: [
    { required: true, message: 'Description is required' },
    { min: 10, message: 'Minimum 10 characters' },
    { max: 500, message: 'Maximum 500 characters' }
  ],
  content: [
    { required: true, message: 'Content is required' },
    { min: 100, message: 'Minimum 100 characters' }
  ],
  categoryIds: [
    { required: true, message: 'Select at least one category' }
  ],
  thumbnail: [
    { message: 'Invalid image format' } // Optional
  ]
}
```

### Key Methods:

```typescript
// Lifecycle
onMounted(): void
loadPost(postId: string): Promise<void>
loadCategories(): Promise<void>

// Form Handling
handleSubmit(): Promise<void>
handleSaveAndPublish(): Promise<void>
handleSaveDraft(): Promise<void>
handleCancel(): void
resetForm(): void

// File Upload
handleImageUpload(file: File): void
removeImage(): void

// Form Utilities
validateForm(): Promise<boolean>
markChanged(): void
promptUnsavedChanges(): boolean
```

---

## API Endpoints

### Service File: `src/api/post.ts`

```typescript
// Get paginated list of posts
export function getPostList(params: {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: PostStatus;
  dateRange?: [string, string];
}): Promise<ApiResponse<PostListResponse>>

// Get single post by ID
export function getPostById(id: string): Promise<ApiResponse<Post>>

// Create new post
export function createPost(data: CreatePostRequest): Promise<ApiResponse<Post>>

// Update existing post
export function updatePost(id: string, data: UpdatePostRequest): Promise<ApiResponse<Post>>

// Delete single post
export function deletePost(id: string): Promise<ApiResponse<void>>

// Bulk delete posts
export function deletePostsBulk(ids: string[]): Promise<ApiResponse<{ deleted: number }>>

// Get all categories
export function getCategories(): Promise<ApiResponse<Category[]>>

// Publish post
export function publishPost(id: string): Promise<ApiResponse<Post>>

// Archive post
export function archivePost(id: string): Promise<ApiResponse<Post>>
```

### Mock API Implementation Example:

```typescript
// Simulated delay for network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Vue 3',
    description: 'Learn the basics of Vue 3...',
    content: 'Vue 3 is a progressive JavaScript framework...',
    categories: [{ id: 'tech', name: 'Technology', slug: 'tech' }],
    status: PostStatus.PUBLISHED,
    visibility: PostVisibility.PUBLIC,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-15T10:30:00Z',
    authorId: 'user1',
    slug: 'getting-started-vue-3',
    viewCount: 1250,
    commentCount: 23
  }
  // ... more mock posts
]

export async function getPostList(params): Promise<ApiResponse<PostListResponse>> {
  await delay(500) // Simulate network delay
  
  let filtered = [...mockPosts]
  
  // Apply filters
  if (params.title) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(params.title.toLowerCase())
    )
  }
  
  if (params.status) {
    filtered = filtered.filter(p => p.status === params.status)
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
```

---

## Internationalization

### English Translations (`src/locales/lang/en-Us.ts`):

```typescript
// Menu labels
'menu.post': 'Posts',
'menu.post.list': 'Post List',
'menu.post.create': 'Create Post',
'menu.post.detail': 'Post Detail',
'menu.post.edit': 'Edit Post',

// Common labels
'post.title': 'Title',
'post.description': 'Description',
'post.content': 'Content',
'post.thumbnail': 'Thumbnail Image',
'post.category': 'Categories',
'post.status': 'Status',
'post.publishTime': 'Publish Time',
'post.createdAt': 'Created Date',
'post.updatedAt': 'Updated Date',
'post.publishedAt': 'Published Date',
'post.visibility': 'Visibility',

// Status labels
'post.status.draft': 'Draft',
'post.status.published': 'Published',
'post.status.archived': 'Archived',

// Visibility labels
'post.visibility.public': 'Public',
'post.visibility.private': 'Private',

// Actions
'post.action.create': 'Create Post',
'post.action.edit': 'Edit',
'post.action.delete': 'Delete',
'post.action.detail': 'View Detail',
'post.action.publish': 'Publish',
'post.action.save': 'Save',
'post.action.saveDraft': 'Save as Draft',
'post.action.bulkDelete': 'Bulk Delete',
'post.action.cancel': 'Cancel',

// Messages
'post.message.deleteConfirm': 'Are you sure you want to delete this post?',
'post.message.bulkDeleteConfirm': 'Are you sure you want to delete {count} selected posts?',
'post.message.unsavedChanges': 'You have unsaved changes. Do you want to discard them?',
'post.message.deleteSuccess': 'Post deleted successfully',
'post.message.createSuccess': 'Post created successfully',
'post.message.updateSuccess': 'Post updated successfully',

// Validation
'post.validation.titleRequired': 'Title is required',
'post.validation.descriptionRequired': 'Description is required',
'post.validation.contentRequired': 'Content is required',
'post.validation.categoryRequired': 'Select at least one category',
'post.validation.titleMinLength': 'Title must be at least 3 characters',
'post.validation.titleMaxLength': 'Title must not exceed 200 characters',
'post.validation.descriptionMinLength': 'Description must be at least 10 characters',
'post.validation.descriptionMaxLength': 'Description must not exceed 500 characters',
'post.validation.contentMinLength': 'Content must be at least 100 characters',

// Table headers
'post.table.title': 'Title',
'post.table.status': 'Status',
'post.table.createdAt': 'Created',
'post.table.updatedAt': 'Updated',
'post.table.publishedAt': 'Published',
'post.table.action': 'Action',
```

### Vietnamese Translations (`src/locales/lang/vi-VN.ts`):

```typescript
// Menu labels
'menu.post': 'Bài viết',
'menu.post.list': 'Danh sách bài viết',
'menu.post.create': 'Thêm bài viết',
'menu.post.detail': 'Chi tiết bài viết',
'menu.post.edit': 'Sửa bài viết',

// Common labels
'post.title': 'Tiêu đề',
'post.description': 'Mô tả',
'post.content': 'Nội dung',
'post.thumbnail': 'Hình ảnh đại diện',
'post.category': 'Danh mục',
'post.status': 'Trạng thái',
'post.publishTime': 'Thời gian xuất bản',
'post.createdAt': 'Ngày tạo',
'post.updatedAt': 'Ngày cập nhật',
'post.publishedAt': 'Ngày xuất bản',
'post.visibility': 'Chế độ công khai',

// Status labels
'post.status.draft': 'Nháp',
'post.status.published': 'Đã xuất bản',
'post.status.archived': 'Đã lưu trữ',

// Visibility labels
'post.visibility.public': 'Công khai',
'post.visibility.private': 'Riêng tư',

// Actions
'post.action.create': 'Thêm bài viết',
'post.action.edit': 'Sửa',
'post.action.delete': 'Xóa',
'post.action.detail': 'Xem chi tiết',
'post.action.publish': 'Xuất bản',
'post.action.save': 'Lưu',
'post.action.saveDraft': 'Lưu nháp',
'post.action.bulkDelete': 'Xóa hàng loạt',
'post.action.cancel': 'Hủy',

// Messages
'post.message.deleteConfirm': 'Bạn có chắc chắn muốn xóa bài viết này không?',
'post.message.bulkDeleteConfirm': 'Bạn có chắc chắn muốn xóa {count} bài viết được chọn không?',
'post.message.unsavedChanges': 'Bạn có thay đổi chưa lưu. Bạn có muốn bỏ qua chúng không?',
'post.message.deleteSuccess': 'Xóa bài viết thành công',
'post.message.createSuccess': 'Tạo bài viết thành công',
'post.message.updateSuccess': 'Cập nhật bài viết thành công',

// Validation
'post.validation.titleRequired': 'Tiêu đề là bắt buộc',
'post.validation.descriptionRequired': 'Mô tả là bắt buộc',
'post.validation.contentRequired': 'Nội dung là bắt buộc',
'post.validation.categoryRequired': 'Chọn ít nhất một danh mục',
'post.validation.titleMinLength': 'Tiêu đề phải có ít nhất 3 ký tự',
'post.validation.titleMaxLength': 'Tiêu đề không được vượt quá 200 ký tự',
'post.validation.descriptionMinLength': 'Mô tả phải có ít nhất 10 ký tự',
'post.validation.descriptionMaxLength': 'Mô tả không được vượt quá 500 ký tự',
'post.validation.contentMinLength': 'Nội dung phải có ít nhất 100 ký tự',

// Table headers
'post.table.title': 'Tiêu đề',
'post.table.status': 'Trạng thái',
'post.table.createdAt': 'Ngày tạo',
'post.table.updatedAt': 'Ngày cập nhật',
'post.table.publishedAt': 'Ngày xuất bản',
'post.table.action': 'Thao tác',
```

---

## Implementation Steps

### Phase 1: Setup (Foundation)

1. **Create TypeScript Types** (`src/types/post.ts`)
   - Define Post, Category, CreatePostRequest interfaces
   - Define enums for PostStatus and PostVisibility
   - Create API response types

2. **Create API Service** (`src/api/post.ts`)
   - Implement mock API functions
   - Add proper error handling
   - Implement data transformation

3. **Add Constants** (`src/constant/post.ts`)
   - Status color mapping
   - Default pagination settings
   - Form validation rules

4. **Update i18n** 
   - Add all localization keys to English and Vietnamese files
   - Add form field labels to form locale files

### Phase 2: Components (UI)

5. **Create Post List Component** (`src/views/post/List.vue`)
   - Implement search form
   - Implement data table with selection
   - Implement pagination
   - Add action handlers

6. **Create Post Detail Component** (`src/views/post/Detail.vue`)
   - Display post information
   - Display post content
   - Add action buttons

7. **Create Post Form Component** (`src/views/post/CreateEdit.vue`)
   - Implement form with all fields
   - Add image upload
   - Add category multi-select
   - Add date/time picker
   - Add form validation

### Phase 3: Routing & Integration

8. **Update Router Configuration** (`src/router/route.config.ts`)
   - Add post menu group
   - Register all post routes
   - Set proper meta information

9. **Update Menu** (if needed in `src/layouts/components/AppSider.vue`)
   - Add post menu item with icon

### Phase 4: Testing & Polish

10. **Test All Features**
    - Test search and filtering
    - Test CRUD operations
    - Test bulk delete
    - Test form validation
    - Test responsive design

11. **Polish UI/UX**
    - Add loading states
    - Add error messages
    - Add success notifications
    - Improve accessibility

---

## Testing Guide

### Test Cases for Post List Page:

1. **Search Functionality**
   - [ ] Search by title returns matching posts
   - [ ] Date range filter works correctly
   - [ ] Status filter shows only selected status posts
   - [ ] Reset button clears all filters
   - [ ] Search with empty results displays "No data" message

2. **Table Operations**
   - [ ] Table displays all columns correctly
   - [ ] Checkbox selection works
   - [ ] Bulk delete button appears when rows are selected
   - [ ] Pagination works and shows correct items
   - [ ] Click detail button navigates to detail page
   - [ ] Click edit button navigates to edit page

3. **Delete Operations**
   - [ ] Delete single post shows confirmation
   - [ ] Bulk delete shows item count confirmation
   - [ ] Deleted posts are removed from table
   - [ ] Success message displays after deletion

4. **Responsive Design**
   - [ ] Table scrolls horizontally on mobile
   - [ ] Search form stacks correctly
   - [ ] Action buttons are accessible on all screen sizes

### Test Cases for Post Detail Page:

1. **Display**
   - [ ] Post information displays correctly
   - [ ] Thumbnail image loads
   - [ ] Status badge shows correct status
   - [ ] Categories display as tags
   - [ ] Dates are formatted correctly

2. **Navigation**
   - [ ] Back button returns to list
   - [ ] Edit button navigates to edit page with pre-filled data
   - [ ] Delete button shows confirmation

### Test Cases for Post Create/Edit Page:

1. **Form Validation**
   - [ ] Required fields show error when empty
   - [ ] Title validation enforces min/max length
   - [ ] Description validation enforces min/max length
   - [ ] Content validation enforces minimum length
   - [ ] At least one category must be selected

2. **Image Upload**
   - [ ] Image upload accepts valid formats
   - [ ] Image preview displays after upload
   - [ ] Image can be removed
   - [ ] File size validation works

3. **Form Submission**
   - [ ] Save button creates new post
   - [ ] Save & Publish sets status to published
   - [ ] Save as Draft sets status to draft
   - [ ] Edit updates existing post
   - [ ] Success message displays after save
   - [ ] Form clears after successful submission

4. **Data Persistence**
   - [ ] In create mode, form starts empty
   - [ ] In edit mode, form pre-populates with post data
   - [ ] Modified data is correctly sent to API

---

## Future Enhancements

### Short-term Enhancements:

1. **Rich Text Editor**
   - Integrate Vue Quill Editor or Tiptap for better post content editing
   - Support for text formatting, lists, links, images
   - Preview mode for edited content

2. **Author Management**
   - Display author information
   - Filter posts by author
   - Assign post to different authors

3. **Comments Management**
   - View and moderate post comments
   - Delete spam comments
   - Batch comment operations

4. **Search Improvements**
   - Full-text search across content
   - Search suggestions/autocomplete
   - Advanced search with multiple criteria

### Medium-term Enhancements:

5. **Publishing Schedule**
   - Schedule posts for automatic publishing
   - Edit published dates
   - Display scheduled posts separately

6. **Post Revisions**
   - Keep version history
   - Compare revisions
   - Restore previous versions

7. **Analytics**
   - View post statistics (views, comments, engagement)
   - Popular posts dashboard
   - Performance metrics

8. **SEO Management**
   - Meta title and description editor
   - SEO score indicator
   - URL slug customization

### Long-term Enhancements:

9. **Collaboration Features**
   - Multiple authors per post
   - Post approval workflows
   - Comments and reviews

10. **Advanced Categorization**
    - Hierarchical categories (tags)
    - Multiple category assignment with hierarchy
    - Category management interface

11. **Batch Operations**
    - Bulk status changes
    - Bulk category assignment
    - Bulk export/import

12. **API Integration**
    - Replace mock API with real backend
    - Authentication tokens
    - Error handling and retry logic

---

## Summary

The Post Management System provides a complete solution for managing blog posts with:

- **Intuitive List View**: Search, filter, and manage multiple posts
- **Powerful Editing**: Rich form for creating and editing posts
- **Bulk Operations**: Efficiently manage multiple posts at once
- **Internationalization**: Full support for English and Vietnamese
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Extensible Architecture**: Easy to add new features

All components follow Ant Design Vue patterns and integrate seamlessly with the existing Vue 3 + TypeScript application.

