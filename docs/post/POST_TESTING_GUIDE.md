# Post Management System - Quick Start & Testing Guide

## 🚀 Quick Start

### Access the Post Management System

1. Open the application in your browser (http://localhost:5173 by default)
2. Login if required
3. In the sidebar, find **"Posts"** menu item (or **"Bài viết"** in Vietnamese)
4. Click to expand and see sub-items:
   - Post List
   - Create Post

---

## 📋 Post List Page Testing

### URL: `/post/list`

### Test Cases:

#### 1. View All Posts
- [ ] Click on "Posts" → "Post List" in sidebar
- [ ] Table should display all posts with columns: Checkbox, Title, Status, Created, Updated, Published, Actions
- [ ] Should see 4 sample posts initially
- [ ] Pagination shows "共 4 条" (Total: 4 items)

#### 2. Search by Title
- [ ] Enter "Vue" in the Title search field
- [ ] Click "Search" button
- [ ] Results should show only posts with "Vue" in the title
- [ ] Should see "Getting Started with Vue 3" and "Ant Design Vue 4 Components Overview"

#### 3. Filter by Status
- [ ] Click Status dropdown
- [ ] Select "Draft"
- [ ] Click "Search"
- [ ] Should show only draft posts
- [ ] Should see "Ant Design Vue 4 Components Overview"

#### 4. Filter by Date Range
- [ ] Click "展开" (Expand) to show advanced search
- [ ] Select a date range in "Created Date" picker
- [ ] Click "Search"
- [ ] Results should filter by date

#### 5. Reset Filters
- [ ] After applying filters, click "Reset" button
- [ ] All filters should clear
- [ ] Should see all posts again

#### 6. View Post Detail
- [ ] Click "View Detail" action on any post row
- [ ] Should navigate to detail page
- [ ] Should show full post information

#### 7. Edit Post
- [ ] Click "Edit" action on any post row
- [ ] Should navigate to edit page with form pre-filled

#### 8. Delete Single Post
- [ ] Click "Delete" action on any post row
- [ ] Confirmation modal should appear: "Are you sure you want to delete this post?"
- [ ] Click "OK" to confirm
- [ ] Post should be removed from list
- [ ] Success message: "Post deleted successfully"

#### 9. Select Multiple Posts (Bulk Delete)
- [ ] Check checkbox on 2-3 posts
- [ ] "Bulk Delete (N)" button should appear
- [ ] Button should show the number of selected posts
- [ ] Click "Bulk Delete" button
- [ ] Confirmation modal should show: "Are you sure you want to delete X selected posts?"
- [ ] Click "OK" to confirm
- [ ] Posts should be removed
- [ ] Success message: "Post deleted successfully"
- [ ] Selected row keys should clear

#### 10. Create New Post
- [ ] Click "New Post" button
- [ ] Should navigate to Create Post page

#### 11. Pagination
- [ ] Change page size from dropdown (10, 20, 50)
- [ ] Click on page numbers to navigate
- [ ] Should update table content accordingly

---

## ➕ Post Create Page Testing

### URL: `/post/create`

### Test Cases:

#### 1. Access Create Page
- [ ] Click "New Post" button from list page
- [ ] Should navigate to `/post/create`
- [ ] Page title should show "Create Post"
- [ ] Form should be empty

#### 2. Form Validation - Title
- [ ] Leave title empty, try to submit
- [ ] Error: "Title is required"
- [ ] Enter 1-2 characters
- [ ] Error: "Title must be at least 3 characters"
- [ ] Enter 201 characters
- [ ] Error: "Title must not exceed 200 characters"
- [ ] Enter valid title (3-200 chars)
- [ ] Character count should update in real-time

#### 3. Form Validation - Description
- [ ] Leave description empty, try to submit
- [ ] Error: "Description is required"
- [ ] Enter short description (< 10 chars)
- [ ] Error: "Description must be at least 10 characters"
- [ ] Enter > 500 characters
- [ ] Error: "Description must not exceed 500 characters"
- [ ] Character count should update in real-time

#### 4. Form Validation - Content
- [ ] Leave content empty, try to submit
- [ ] Error: "Content is required"
- [ ] Enter < 100 characters
- [ ] Error: "Content must be at least 100 characters"
- [ ] Character count should display

#### 5. Category Selection
- [ ] Try to submit without selecting category
- [ ] Error: "Select at least one category"
- [ ] Click category dropdown
- [ ] Select 1-3 categories
- [ ] Selected categories should show as tags

#### 6. Thumbnail Upload
- [ ] Click upload area or drag & drop image
- [ ] Image should show preview
- [ ] Can remove image by clicking X
- [ ] Image input is optional

#### 7. Publish Time
- [ ] Click date picker
- [ ] Select a date and time
- [ ] Selected date/time should appear in field
- [ ] Field is optional

#### 8. Visibility Selection
- [ ] Should see radio buttons: "Public" and "Private"
- [ ] Default should be "Public"
- [ ] Can select "Private"

#### 9. Save Post
- [ ] Fill all required fields with valid data
- [ ] Click "Save" button
- [ ] Button should show loading state
- [ ] Success message: "Post created successfully"
- [ ] Should redirect to Post List page
- [ ] New post should appear in the list

#### 10. Save as Draft
- [ ] Fill required fields
- [ ] Click "Save as Draft" button (only in create mode)
- [ ] Post should be created with "Draft" status
- [ ] Success message should show
- [ ] Should redirect to list

#### 11. Cancel with Unsaved Changes
- [ ] Fill some fields but don't submit
- [ ] Click "Cancel" button
- [ ] Confirmation modal: "You have unsaved changes. Do you want to discard them?"
- [ ] Click "OK" to discard
- [ ] Should navigate back to list
- [ ] Click "Cancel" again without changes
- [ ] Should navigate back without confirmation

---

## 📖 Post Detail Page Testing

### URL: `/post/:id/detail` (e.g., `/post/1/detail`)

### Test Cases:

#### 1. View Post Information
- [ ] Navigate to detail page
- [ ] Should display post title as large heading
- [ ] Should show status badge
- [ ] Should show creation date
- [ ] Should show updated date
- [ ] Should show published date (if available)
- [ ] Should show thumbnail image
- [ ] Should show description
- [ ] Should show categories as tags

#### 2. View Post Content
- [ ] Scroll down to see full post content
- [ ] Content should be readable with proper formatting
- [ ] Content should preserve line breaks

#### 3. Edit Button
- [ ] Click "Edit" button
- [ ] Should navigate to edit page
- [ ] Form should pre-fill with post data

#### 4. Delete Button
- [ ] Click "Delete" button
- [ ] Confirmation modal should appear
- [ ] Click "OK" to delete
- [ ] Success message should show
- [ ] Should navigate back to list

#### 5. Back Button
- [ ] Click "Back" button
- [ ] Should navigate to Post List page

#### 6. Image Display
- [ ] If post has thumbnail, should display image
- [ ] Click image to open lightbox
- [ ] Can close lightbox

---

## ✏️ Post Edit Page Testing

### URL: `/post/:id/edit` (e.g., `/post/1/edit`)

### Test Cases:

#### 1. Access Edit Page
- [ ] Click "Edit" action on list or detail page
- [ ] Should navigate to edit page
- [ ] Page title should show "Edit Post"
- [ ] Form should be pre-filled with post data

#### 2. Form Pre-population
- [ ] Title field should have post's title
- [ ] Description should have post's description
- [ ] Content should have post's content
- [ ] Categories should be pre-selected
- [ ] Thumbnail should show image preview
- [ ] Publish time should show if set
- [ ] Visibility should match post's visibility

#### 3. Edit Validation
- [ ] Same validation rules as create page
- [ ] Can modify any field
- [ ] Character counts update in real-time

#### 4. Modify and Save
- [ ] Change title
- [ ] Click "Save"
- [ ] Success message: "Post updated successfully"
- [ ] Should redirect to list
- [ ] Changes should be visible in the list

#### 5. Cancel Edit
- [ ] Make changes
- [ ] Click "Cancel"
- [ ] Confirmation modal should appear
- [ ] Click "OK" to discard changes
- [ ] Should navigate back to list

#### 6. "Save as Draft" Not Available
- [ ] "Save as Draft" button should NOT appear in edit mode
- [ ] Only "Save" and "Cancel" buttons available

---

## 🌍 Internationalization Testing

### English (en-US)

#### 1. Navigate to English Menu
- [ ] All menu items should show in English:
  - "Posts"
  - "Post List"
  - "Create Post"
  - "Post Detail"
  - "Edit Post"

#### 2. Check Form Labels
- [ ] Title, Description, Content, etc. should be in English
- [ ] All validation messages in English
- [ ] All action buttons in English

#### 3. Check Success Messages
- [ ] Success messages in English
- [ ] Error messages in English

### Vietnamese (vi-VN)

#### 1. Change Language to Vietnamese
- [ ] Switch language to Vietnamese (vi-VN)
- [ ] Menu should update:
  - "Bài viết"
  - "Danh sách bài viết"
  - "Thêm bài viết"
  - "Chi tiết bài viết"
  - "Sửa bài viết"

#### 2. Check Form Labels
- [ ] Form labels in Vietnamese
- [ ] Tiêu đề (Title)
- [ ] Mô tả (Description)
- [ ] Nội dung (Content)
- [ ] Danh mục (Categories)
- [ ] Hình ảnh đại diện (Thumbnail)

#### 3. Check Messages
- [ ] Validation messages in Vietnamese
- [ ] Success/error messages in Vietnamese
- [ ] All button labels in Vietnamese

---

## 🎯 Feature Checklist

### Post List Page
- [ ] Display posts in table
- [ ] Search by title
- [ ] Filter by status (Draft, Published, Archived)
- [ ] Filter by date range
- [ ] Pagination
- [ ] View detail action
- [ ] Edit action
- [ ] Delete single post
- [ ] Bulk select and delete
- [ ] Create new post button
- [ ] Reset filters
- [ ] Advanced filter toggle
- [ ] Status badges with colors
- [ ] Date formatting

### Post Detail Page
- [ ] Display post title
- [ ] Display status badge
- [ ] Display thumbnail
- [ ] Display description
- [ ] Display categories as tags
- [ ] Display full content
- [ ] Display dates (created, updated, published)
- [ ] Back button
- [ ] Edit button
- [ ] Delete button
- [ ] Loading state
- [ ] Error handling

### Post Create Page
- [ ] Title input with validation and character count
- [ ] Description input with validation and character count
- [ ] Content textarea with character count
- [ ] Thumbnail upload with preview
- [ ] Category multi-select
- [ ] Publish time picker
- [ ] Visibility selection (public/private)
- [ ] Save button
- [ ] Save as Draft button
- [ ] Cancel button with unsaved changes warning
- [ ] Form validation
- [ ] Success message
- [ ] Redirect to list after save
- [ ] Loading state

### Post Edit Page
- [ ] Same as create page
- [ ] Pre-filled form data
- [ ] No "Save as Draft" button
- [ ] Update post
- [ ] Success message
- [ ] Redirect to list

### Internationalization
- [ ] English translations
- [ ] Vietnamese translations
- [ ] Language switching
- [ ] All UI text translated

---

## 🐛 Known Issues & Notes

- Mock API uses simulated delays (200-800ms)
- Images stored as base64 in demo mode
- No real backend required for testing
- All data stored in browser memory (resets on page refresh)
- Category list is fixed (cannot add new categories in demo)

---

## 💡 Tips for Testing

1. **Test data persists**: Mock data persists during the session but resets on page refresh
2. **Browser DevTools**: Use Network tab to see simulated API delays
3. **Empty states**: Try deleting all posts to see empty state
4. **Mobile testing**: Use browser device emulation to test responsive design
5. **Form validation**: Try invalid inputs to test all validation rules
6. **Language switching**: Test both English and Vietnamese UI

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ All UI elements responsive
- ✅ Proper form validation
- ✅ All CRUD operations working
- ✅ i18n working for both languages
- ✅ Loading states visible
- ✅ Error handling graceful
- ✅ Navigation working correctly

