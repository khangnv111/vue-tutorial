<template>
  <a-card :bordered="false">
    <template #title>
      <a-space>
        <a-button type="text" @click="handleBack">
          <template #icon><ArrowLeftOutlined /></template>
          {{ t('common.back') }}
        </a-button>
        <span>{{ t('menu.post.detail') }}</span>
      </a-space>
    </template>

    <template #extra>
      <a-space>
        <a-button type="primary" @click="handleEdit">
          {{ t('post.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="t('post.message.deleteConfirm')"
          ok-text="OK"
          cancel-text="Cancel"
          @confirm="handleDelete"
        >
          <a-button danger>
            {{ t('post.action.delete') }}
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>

    <a-spin :spinning="loading">
      <div v-if="post" class="post-detail-container">
        <!-- Post Header -->
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <a-space>
              <a-badge
                :status="POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].status"
                :text="t(POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].label)"
              />
              <span>{{ t('post.createdAt') }}: {{ formatDate(post.createdAt) }}</span>
              <span v-if="post.publishedAt">
                {{ t('post.publishedAt') }}: {{ formatDate(post.publishedAt) }}
              </span>
            </a-space>
          </div>
        </div>

        <a-divider />

        <!-- Thumbnail -->
        <div v-if="post.thumbnail" class="post-thumbnail">
          <a-image
            :src="post.thumbnail"
            :width="400"
            style="max-width: 100%"
          />
        </div>

        <a-divider />

        <!-- Post Information -->
        <a-descriptions :column="1" bordered>
          <a-descriptions-item :label="t('post.description')">
            {{ post.description }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('post.category')">
            <a-space>
              <a-tag
                v-for="category in post.categories"
                :key="category.id"
                color="blue"
              >
                {{ category.name }}
              </a-tag>
            </a-space>
          </a-descriptions-item>

          <a-descriptions-item :label="t('post.status')">
            <a-badge
              :status="POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].status"
              :text="t(POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG].label)"
            />
          </a-descriptions-item>

          <a-descriptions-item :label="t('post.visibility')">
            {{ t('post.visibility.' + post.visibility) }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('post.createdAt')">
            {{ formatDate(post.createdAt) }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('post.updatedAt')">
            {{ formatDate(post.updatedAt) }}
          </a-descriptions-item>

          <a-descriptions-item v-if="post.publishedAt" :label="t('post.publishedAt')">
            {{ formatDate(post.publishedAt) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <!-- Post Content -->
        <div class="post-content-section">
          <h2>{{ t('post.content') }}</h2>
          <div class="post-content">
            {{ post.content }}
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <a-empty />
      </div>
    </a-spin>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
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
  padding: 24px 0;
}

.post-header {
  margin-bottom: 24px;
}

.post-title {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.4;
}

.post-meta {
  color: #8c8c8c;
  font-size: 14px;
}

.post-thumbnail {
  text-align: center;
  margin: 24px 0;
}

.post-content-section {
  margin-top: 32px;
}

.post-content-section h2 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
}

.post-content {
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  color: #262626;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
}
</style>
