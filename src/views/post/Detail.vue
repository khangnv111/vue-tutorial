<template>
  <div class="post-detail-container">
    <!-- Back Button -->
    <a-button type="text" class="back-button" @click="handleBack">
      <template #icon><ArrowLeftOutlined /></template>
      返回列表
    </a-button>

    <a-spin :spinning="loading">
      <div v-if="post" class="post-detail-wrapper">
        <!-- Post Header -->
        <div class="post-header-section">
          <!-- Thumbnail -->
          <div v-if="post.thumbnail" class="post-thumbnail-wrapper">
            <a-image
              :src="post.thumbnail"
              :preview="true"
              class="post-thumbnail"
            />
          </div>
          <div v-else class="post-thumbnail-placeholder">
            <PictureOutlined />
            <p>暂无缩略图</p>
          </div>

          <!-- Post Meta -->
          <div class="post-meta-section">
            <h1 class="post-detail-title">{{ post.title }}</h1>

            <div class="post-meta-info">
              <div class="meta-item">
                <span class="meta-label">状态:</span>
                <a-badge
                  :status="POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].status"
                  :text="t(POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].label)"
                />
              </div>

              <div class="meta-item">
                <span class="meta-label">{{ t('post.visibility') }}:</span>
                <a-tag color="blue">{{ t('post.visibility.' + post.visibility) }}</a-tag>
              </div>
            </div>

            <div class="post-timestamps">
              <div class="timestamp-item">
                <CalendarOutlined />
                <span>{{ t('post.createdAt') }}: {{ formatDate(post.createdAt) }}</span>
              </div>
              <div class="timestamp-item">
                <ClockCircleOutlined />
                <span>{{ t('post.updatedAt') }}: {{ formatDate(post.updatedAt) }}</span>
              </div>
              <div v-if="post.publishedAt" class="timestamp-item">
                <CheckCircleOutlined />
                <span>{{ t('post.publishedAt') }}: {{ formatDate(post.publishedAt) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="post-actions">
              <a-button type="primary" size="large" @click="handleEdit">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除此文章吗？"
                description="删除后将无法恢复"
                ok-text="是"
                cancel-text="否"
                @confirm="handleDelete"
              >
                <a-button danger size="large">
                  <template #icon><DeleteOutlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>

        <a-divider />

        <!-- Description -->
        <div class="post-section">
          <h3 class="section-title">{{ t('post.description') }}</h3>
          <div class="section-content description-text">
            {{ post.description }}
          </div>
        </div>

        <!-- Categories -->
        <div v-if="post.categories.length > 0" class="post-section">
          <h3 class="section-title">{{ t('post.category') }}</h3>
          <div class="categories-wrapper">
            <a-tag
              v-for="category in post.categories"
              :key="category.id"
              color="blue"
              class="category-tag"
            >
              {{ category.name }}
            </a-tag>
          </div>
        </div>

        <a-divider />

        <!-- Post Content -->
        <div class="post-section content-section">
          <h3 class="section-title">{{ t('post.content') }}</h3>
          <div class="post-content">
            {{ post.content }}
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <a-empty description="加载中或文章不存在" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PictureOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getPostById, deletePost } from '@/api/post'
import type { Post } from '@/types/post'
import { POST_STATUS_CONFIG } from '@/constant/post'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// State
const post = ref<Post | null>(null)
const loading = ref(false)

// Methods
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const loadPost = async () => {
  loading.value = true
  try {
    const postId = route.params.id as string
    const res = await getPostById(postId)

    if (res.success && res.data) {
      post.value = res.data
    } else {
      message.error(res.error || t('common.error'))
      handleBack()
    }
  } catch (err) {
    message.error(t('common.error'))
    handleBack()
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'PostList' })
}

const handleEdit = () => {
  router.push({ name: 'PostEdit', params: { id: route.params.id } })
}

const handleDelete = async () => {
  try {
    const res = await deletePost(route.params.id as string)
    if (res.success) {
      message.success(t('post.message.deleteSuccess'))
      handleBack()
    } else {
      message.error(res.error || t('common.error'))
    }
  } catch (err) {
    message.error(t('common.error'))
  }
}

// Lifecycle
onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.back-button {
  margin-bottom: 16px;
  font-size: 14px;
  color: #1890ff;
  padding-left: 0;
}

.back-button:hover {
  color: #40a9ff;
}

/* Post Detail Wrapper */
.post-detail-wrapper {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

/* Header Section */
.post-header-section {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 40px;
  padding: 40px;
  align-items: start;
}

.post-thumbnail-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-thumbnail {
  width: 100%;
  height: auto;
  display: block;
}

.post-thumbnail-placeholder {
  width: 100%;
  height: 360px;
  background: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
}

.post-thumbnail-placeholder svg {
  font-size: 48px;
  margin-bottom: 12px;
}

/* Meta Section */
.post-meta-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-detail-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.4;
  color: #262626;
  word-break: break-word;
}

.post-meta-info {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: #8c8c8c;
  font-weight: 500;
}

.post-timestamps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.timestamp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #595959;
  font-size: 14px;
}

.timestamp-item svg {
  color: #1890ff;
  font-size: 14px;
}

/* Action Buttons */
.post-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.post-actions :deep(.ant-button) {
  min-width: 120px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
}

/* Sections */
.post-section {
  padding: 40px;
  border-bottom: 1px solid #f0f0f0;
}

.post-section:last-child {
  border-bottom: none;
  padding-bottom: 40px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.section-content {
  font-size: 15px;
  line-height: 1.8;
  color: #595959;
}

.description-text {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

/* Categories */
.categories-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 4px;
  font-weight: 500;
}

/* Content */
.content-section {
  padding: 40px;
}

.post-content {
  font-size: 15px;
  line-height: 1.8;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Empty State */
.empty-state {
  padding: 80px 40px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .post-detail-container {
    padding: 12px;
  }

  .post-header-section {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }

  .post-detail-title {
    font-size: 24px;
  }

  .post-thumbnail-wrapper,
  .post-thumbnail-placeholder {
    height: 240px;
  }

  .post-meta-info {
    flex-direction: column;
    gap: 12px;
  }

  .post-actions {
    flex-direction: column;
  }

  .post-actions :deep(.ant-button) {
    width: 100%;
  }

  .post-section {
    padding: 24px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-content,
  .post-content {
    font-size: 14px;
  }
}

:deep(.ant-divider) {
  margin: 0;
}
</style>
