<template>
  <a-card :bordered="false">
    <template #title>
      <a-space>
        <a-button type="text" @click="handleCancel">
          <template #icon><ArrowLeftOutlined /></template>
          {{ t('common.back') }}
        </a-button>
        <span>{{ isEdit ? t('menu.post.edit') : t('menu.post.create') }}</span>
      </a-space>
    </template>

    <a-spin :spinning="submitting">
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- Title -->
        <a-form-item name="title" :label="t('post.title')">
          <a-input
            v-model:value="formData.title"
            :placeholder="t('post.title')"
            :maxlength="200"
            @input="markChanged"
          />
          <div class="char-count">{{ formData.title.length }}/200</div>
        </a-form-item>

        <!-- Thumbnail -->
        <a-form-item name="thumbnail" :label="t('post.thumbnail')">
          <a-upload
            v-model:file-list="fileList"
            :max-count="1"
            accept="image/*"
            list-type="picture-card"
            @change="handleImageUpload"
          >
            <div v-if="fileList.length === 0">
              <PlusOutlined />
              <div style="margin-top: 8px">{{ t('post.thumbnail') }}</div>
            </div>
          </a-upload>
        </a-form-item>

        <!-- Description -->
        <a-form-item name="description" :label="t('post.description')">
          <a-textarea
            v-model:value="formData.description"
            :placeholder="t('post.description')"
            :maxlength="500"
            :rows="4"
            @input="markChanged"
          />
          <div class="char-count">{{ formData.description.length }}/500</div>
        </a-form-item>

        <!-- Category -->
        <a-form-item name="categoryIds" :label="t('post.category')">
          <a-select
            v-model:value="formData.categoryIds"
            mode="multiple"
            :placeholder="t('post.category')"
            :options="categoryOptions"
            @change="markChanged"
          />
        </a-form-item>

        <!-- Publish Time -->
        <a-form-item name="publishedAt" :label="t('post.publishTime')">
          <a-date-picker
            v-model:value="formData.publishedAt"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            @change="markChanged"
          />
        </a-form-item>

        <!-- Content -->
        <a-form-item name="content" :label="t('post.content')">
          <a-textarea
            v-model:value="formData.content"
            :placeholder="t('post.content')"
            :rows="8"
            @input="markChanged"
          />
          <div class="char-count">{{ formData.content.length }}</div>
        </a-form-item>

        <!-- Visibility -->
        <a-form-item name="visibility" :label="t('post.visibility')">
          <a-radio-group
            v-model:value="formData.visibility"
            @change="markChanged"
          >
            <a-radio value="public">{{ t('post.visibility.public') }}</a-radio>
            <a-radio value="private">{{ t('post.visibility.private') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- Form Actions -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">
              {{ t('post.action.save') }}
            </a-button>
            <a-button @click="handleSaveDraft" v-if="!isEdit">
              {{ t('post.action.saveDraft') }}
            </a-button>
            <a-button @click="handleCancel">
              {{ t('post.action.cancel') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons-vue'
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
.char-count {
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 4px;
}

:deep(.ant-upload-picture-card-wrapper) {
  display: flex;
}
</style>
