<template>
  <div class="post-form-container">
    <!-- Back Button -->
    <a-button type="text" class="back-button" @click="handleCancel">
      <template #icon><ArrowLeftOutlined /></template>
      返回列表
    </a-button>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ isEdit ? '编辑文章' : '发布新文章' }}</h1>
        <p class="page-subtitle">{{ isEdit ? '修改已有文章内容' : '创建一篇新的文章' }}</p>
      </div>
    </div>

    <a-spin :spinning="submitting">
      <div class="form-wrapper">
        <a-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          layout="vertical"
          @finish="handleSubmit"
          class="post-form"
        >
          <!-- Title -->
          <a-form-item name="title" :label="t('post.title')" class="form-item-large">
            <a-input
              v-model:value="formData.title"
              :placeholder="t('post.title')"
              :maxlength="200"
              size="large"
              @input="markChanged"
              allow-clear
            />
            <div class="char-count">{{ formData.title.length }}/200</div>
          </a-form-item>

          <!-- Row 1: Thumbnail and Description -->
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="12">
              <!-- Thumbnail -->
              <a-form-item name="thumbnail" :label="t('post.thumbnail')">
                <div class="upload-wrapper">
                  <a-upload
                    v-model:file-list="fileList"
                    :max-count="1"
                    accept="image/*"
                    list-type="picture-card"
                    @change="handleImageUpload"
                    class="upload-container"
                  >
                    <div v-if="fileList.length === 0" class="upload-placeholder">
                      <PlusOutlined />
                      <div style="margin-top: 8px">{{ t('post.thumbnail') }}</div>
                    </div>
                  </a-upload>
                </div>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12">
              <!-- Description -->
              <a-form-item name="description" :label="t('post.description')">
                <a-textarea
                  v-model:value="formData.description"
                  :placeholder="t('post.description')"
                  :maxlength="500"
                  :rows="6"
                  @input="markChanged"
                  show-count
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Row 2: Category and Publish Time -->
          <a-row :gutter="24">
            <a-col :xs="24" :sm="24" :md="12">
              <!-- Category -->
              <a-form-item name="categoryIds" :label="t('post.category')">
                <a-select
                  v-model:value="formData.categoryIds"
                  mode="multiple"
                  :placeholder="t('post.category')"
                  :options="categoryOptions"
                  size="large"
                  @change="markChanged"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12">
              <!-- Publish Time -->
              <a-form-item name="publishedAt" :label="t('post.publishTime')">
                <a-date-picker
                  v-model:value="formData.publishedAt"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="t('post.publishTime')"
                  style="width: 100%"
                  size="large"
                  @change="markChanged"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Visibility -->
          <a-form-item name="visibility" :label="t('post.visibility')">
            <a-radio-group v-model:value="formData.visibility" @change="markChanged" size="large">
              <a-radio-button value="public">{{ t('post.visibility.public') }}</a-radio-button>
              <a-radio-button value="private">{{ t('post.visibility.private') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <!-- Content -->
          <a-form-item name="content" :label="t('post.content')" class="form-item-large">
            <a-textarea
              v-model:value="formData.content"
              :placeholder="t('post.content')"
              :rows="12"
              @input="markChanged"
              show-count
            />
          </a-form-item>

          <!-- Form Actions -->
          <a-form-item class="form-actions">
            <a-space>
              <a-button type="primary" size="large" html-type="submit">
                <template #icon><SaveOutlined /></template>
                {{ t('post.action.save') }}
              </a-button>
              <a-button v-if="!isEdit" size="large" @click="handleSaveDraft">
                <template #icon><FileTextOutlined /></template>
                {{ t('post.action.saveDraft') }}
              </a-button>
              <a-button size="large" @click="handleCancel">
                {{ t('post.action.cancel') }}
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined, PlusOutlined, SaveOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import type { FormInstance, UploadChangeParam } from 'ant-design-vue'
import {
  getPostById,
  createPost,
  updatePost,
  getCategories
} from '@/api/post'
import type { Category } from '@/types/post'
import { PostVisibility } from '@/types/post'
import { FORM_CONSTRAINTS } from '@/constant/post'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// State
const formRef = ref<FormInstance>()
const submitting = ref(false)
const loading = ref(false)
const isEdit = computed(() => !!route.params.id)
const categories = ref<Category[]>([])
const fileList = ref<any[]>([])
const hasChanges = ref(false)

const formData = reactive({
  title: '',
  description: '',
  content: '',
  thumbnail: undefined as string | undefined,
  categoryIds: [] as string[],
  publishedAt: undefined as Dayjs | undefined,
  visibility: PostVisibility.PUBLIC
})

// Form rules
const formRules = {
  title: [
    {
      required: true,
      message: t('post.validation.titleRequired'),
      whitespace: true
    },
    {
      min: FORM_CONSTRAINTS.title.minLength,
      message: t('post.validation.titleMinLength')
    },
    {
      max: FORM_CONSTRAINTS.title.maxLength,
      message: t('post.validation.titleMaxLength')
    }
  ],
  description: [
    {
      required: true,
      message: t('post.validation.descriptionRequired'),
      whitespace: true
    },
    {
      min: FORM_CONSTRAINTS.description.minLength,
      message: t('post.validation.descriptionMinLength')
    },
    {
      max: FORM_CONSTRAINTS.description.maxLength,
      message: t('post.validation.descriptionMaxLength')
    }
  ],
  content: [
    {
      required: true,
      message: t('post.validation.contentRequired'),
      whitespace: true
    },
    {
      min: FORM_CONSTRAINTS.content.minLength,
      message: t('post.validation.contentMinLength')
    }
  ],
  categoryIds: [
    {
      required: true,
      message: t('post.validation.categoryRequired'),
      type: 'array',
      min: 1
    }
  ]
}

// Computed
const categoryOptions = computed(() =>
  categories.value.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
)

// Methods
const markChanged = () => {
  hasChanges.value = true
}

const handleImageUpload = (info: UploadChangeParam) => {
  if (info.file.originFileObj) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.thumbnail = e.target?.result as string
      markChanged()
    }
    reader.readAsDataURL(info.file.originFileObj)
  }
}

const loadCategories = async () => {
  try {
    const res = await getCategories()
    if (res.success && res.data) {
      categories.value = res.data
    }
  } catch (err) {
    message.error(t('common.error'))
  }
}

const loadPost = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const postId = route.params.id as string
    const res = await getPostById(postId)

    if (res.success && res.data) {
      const post = res.data
      formData.title = post.title
      formData.description = post.description
      formData.content = post.content
      formData.thumbnail = post.thumbnail
      formData.categoryIds = post.categories.map(c => c.id)
      formData.publishedAt = post.publishedAt ? dayjs(post.publishedAt) : undefined
      formData.visibility = post.visibility

      if (post.thumbnail) {
        fileList.value = [
          {
            uid: '-1',
            name: 'thumbnail',
            status: 'done',
            url: post.thumbnail
          }
        ]
      }

      hasChanges.value = false
    } else {
      message.error(res.error || t('common.error'))
      handleCancel()
    }
  } catch (err) {
    message.error(t('common.error'))
    handleCancel()
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    await formRef.value?.validateFields()

    const payload: any = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      thumbnail: formData.thumbnail,
      categoryIds: formData.categoryIds,
      visibility: formData.visibility
    }

    if (formData.publishedAt) {
      payload.publishedAt = formData.publishedAt.toISOString()
    }

    let res

    if (isEdit.value) {
      payload.id = route.params.id
      res = await updatePost(route.params.id as string, payload)
    } else {
      res = await createPost(payload)
    }

    if (res.success) {
      message.success(
        isEdit.value
          ? t('post.message.updateSuccess')
          : t('post.message.createSuccess')
      )
      hasChanges.value = false
      router.push({ name: 'PostList' })
    } else {
      message.error(res.error || t('common.error'))
    }
  } catch (err: any) {
    message.error(err.message || t('common.error'))
  } finally {
    submitting.value = false
  }
}

const handleSaveDraft = async () => {
  try {
    submitting.value = true
    await formRef.value?.validateFields()

    const payload: any = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      thumbnail: formData.thumbnail,
      categoryIds: formData.categoryIds,
      visibility: formData.visibility
    }

    const res = await createPost(payload)

    if (res.success) {
      message.success(t('post.message.createSuccess'))
      hasChanges.value = false
      router.push({ name: 'PostList' })
    } else {
      message.error(res.error || t('common.error'))
    }
  } catch (err: any) {
    message.error(err.message || t('common.error'))
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    Modal.confirm({
      title: t('post.action.cancel'),
      content: t('post.message.unsavedChanges'),
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        hasChanges.value = false
        router.push({ name: 'PostList' })
      }
    })
  } else {
    router.push({ name: 'PostList' })
  }
}

// Lifecycle
onMounted(async () => {
  await loadCategories()
  await loadPost()
})
</script>

<style scoped>
.post-form-container {
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

/* Page Header */
.page-header {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #262626;
}

.page-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #8c8c8c;
}

/* Form Wrapper */
.form-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.post-form {
  margin: 0;
  max-width: 1000px;
}

/* Form Items */
:deep(.post-form .ant-form-item) {
  margin-bottom: 24px;
}

:deep(.post-form .ant-form-item-label > label) {
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.form-item-large {
  margin-bottom: 32px;
}

/* Input & Textarea */
:deep(.post-form .ant-input),
:deep(.post-form .ant-textarea),
:deep(.post-form .ant-select) {
  border-radius: 6px;
}

:deep(.post-form .ant-input-affix-wrapper),
:deep(.post-form .ant-input-number),
:deep(.post-form .ant-picker) {
  border-radius: 6px;
}

/* Character Count */
.char-count {
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 4px;
  text-align: right;
}

/* Upload Wrapper */
.upload-wrapper {
  padding: 0;
}

:deep(.upload-container .ant-upload) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.upload-container .ant-upload-list) {
  width: 100%;
}

:deep(.upload-container .ant-upload-picture-card-wrapper) {
  display: block;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-placeholder svg {
  font-size: 32px;
  color: #1890ff;
}

/* Form Actions */
.form-actions {
  margin-top: 48px;
  margin-bottom: 0;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.form-actions .ant-form-item-control) {
  margin-top: 0;
}

:deep(.form-actions .ant-button) {
  min-width: 120px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .post-form-container {
    padding: 12px;
  }

  .form-wrapper {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  :deep(.post-form .ant-form-item) {
    margin-bottom: 16px;
  }

  .form-item-large {
    margin-bottom: 24px;
  }

  .form-actions {
    margin-top: 24px;
  }

  :deep(.form-actions .ant-space) {
    width: 100%;
    flex-direction: column;
  }

  :deep(.form-actions .ant-button) {
    width: 100%;
  }
}

/* Spin */
:deep(.ant-spin) {
  width: 100%;
}
</style>
