<template>
  <a-card :bordered="false">
    <!-- Search Form -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :label="t('post.title')">
              <a-input
                v-model:value="queryParam.title"
                :placeholder="t('post.title')"
                @keyup.enter="handleSearch"
              />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item :label="t('post.status')">
              <a-select
                v-model:value="queryParam.status"
                :placeholder="t('post.status')"
              >
                <a-select-option value="all">{{ t('common.ok') }}</a-select-option>
                <a-select-option value="draft">{{ t('post.status.draft') }}</a-select-option>
                <a-select-option value="published">{{ t('post.status.published') }}</a-select-option>
                <a-select-option value="archived">{{ t('post.status.archived') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item :label="t('post.createdAt')">
                <a-range-picker
                  v-model:value="queryParam.dateRange"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="advanced ? 24 : 8" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced ? { float: 'right' } : {}"
            >
              <a-button type="primary" @click="handleSearch">
                {{ t('post.action.search') }}
              </a-button>
              <a-button style="margin-left: 8px" @click="handleReset">
                {{ t('post.action.reset') }}
              </a-button>
              <a style="margin-left: 8px; cursor: pointer;" @click="advanced = !advanced">
                {{ advanced ? '收起' : '展开' }}
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- Operator Buttons -->
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">
        {{ t('post.action.new') }}
      </a-button>
      <a-button
        v-if="selectedRowKeys.length > 0"
        danger
        style="margin-left: 8px"
        @click="handleBulkDelete"
      >
        {{ t('post.action.bulkDelete') }} ({{ selectedRowKeys.length }})
      </a-button>
    </div>

    <!-- Data Table -->
    <a-table
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      @change="handleTableChange"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-badge
            :status="POST_STATUS_CONFIG[record.status as keyof typeof POST_STATUS_CONFIG].status"
            :text="t(POST_STATUS_CONFIG[record.status as keyof typeof POST_STATUS_CONFIG].label)"
          />
        </template>

        <template v-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>

        <template v-if="column.key === 'updatedAt'">
          {{ formatDate(record.updatedAt) }}
        </template>

        <template v-if="column.key === 'publishedAt'">
          {{ record.publishedAt ? formatDate(record.publishedAt) : '-' }}
        </template>

        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="handleDetail(record)">{{ t('post.action.detail') }}</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">{{ t('post.action.edit') }}</a>
            <a-divider type="vertical" />
            <a-popconfirm
              :title="t('post.message.deleteConfirm')"
              ok-text="OK"
              cancel-text="Cancel"
              @confirm="handleDelete(record)"
            >
              <a style="color: red">{{ t('post.action.delete') }}</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  getPostList,
  deletePost,
  deletePostsBulk
} from '@/api/post'
import type { Post } from '@/types/post'
import { POST_STATUS_CONFIG, DEFAULT_PAGE_SIZE } from '@/constant/post'

const router = useRouter()
const { t } = useI18n()

// State
const advanced = ref(false)
const loading = ref(false)
const dataSource = ref<Post[]>([])
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<Post[]>([])

const queryParam = reactive<any>({
  title: '',
  status: 'all',
  dateRange: undefined
})

const pagination = reactive({
  current: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50']
})

// Columns configuration
const columns = [
  {
    title: t('post.table.title'),
    dataIndex: 'title',
    key: 'title',
    width: 200,
    ellipsis: true
  },
  {
    title: t('post.table.status'),
    key: 'status',
    width: 100
  },
  {
    title: t('post.table.createdAt'),
    key: 'createdAt',
    width: 160
  },
  {
    title: t('post.table.updatedAt'),
    key: 'updatedAt',
    width: 160
  },
  {
    title: t('post.table.publishedAt'),
    key: 'publishedAt',
    width: 160
  },
  {
    title: t('post.table.action'),
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// Row selection
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[], rows: Post[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }
}))

// Methods
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      title: queryParam.title,
      status: queryParam.status === 'all' ? undefined : queryParam.status
    }

    if (queryParam.dateRange && queryParam.dateRange.length === 2) {
      params.dateRange = [
        queryParam.dateRange[0].format('YYYY-MM-DD'),
        queryParam.dateRange[1].format('YYYY-MM-DD')
      ]
    }

    const res = await getPostList(params)

    if (res.success && res.data) {
      dataSource.value = res.data.data
      pagination.total = res.data.total
    }
  } catch (err) {
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  queryParam.title = ''
  queryParam.status = 'all'
  queryParam.dateRange = undefined
  pagination.current = 1
  fetchData()
}

const handleTableChange = (pager: any) => {
  pagination.current = pager.current
  pagination.pageSize = pager.pageSize
  fetchData()
}

const handleAdd = () => {
  router.push({ name: 'PostCreate' })
}

const handleDetail = (record: Post) => {
  router.push({ name: 'PostDetail', params: { id: record.id } })
}

const handleEdit = (record: Post) => {
  router.push({ name: 'PostEdit', params: { id: record.id } })
}

const handleDelete = async (record: Post) => {
  try {
    const res = await deletePost(record.id)
    if (res.success) {
      message.success(t('post.message.deleteSuccess'))
      fetchData()
    } else {
      message.error(res.error || t('common.error'))
    }
  } catch (err) {
    message.error(t('common.error'))
  }
}

const handleBulkDelete = () => {
  Modal.confirm({
    title: t('post.action.bulkDelete'),
    content: t('post.message.bulkDeleteConfirm').replace('{count}', selectedRowKeys.value.length.toString()),
    okText: 'OK',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        const res = await deletePostsBulk(selectedRowKeys.value)
        if (res.success) {
          message.success(t('post.message.deleteSuccess'))
          selectedRowKeys.value = []
          selectedRows.value = []
          fetchData()
        } else {
          message.error(res.error || t('common.error'))
        }
      } catch (err) {
        message.error(t('common.error'))
      }
    }
  })
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.table-page-search-wrapper {
  margin-bottom: 24px;
}

.table-operator {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

a {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  color: #40a9ff;
}
</style>
