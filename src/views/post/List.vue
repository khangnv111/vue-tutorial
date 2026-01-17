<template>
  <div class="post-list-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('menu.post.list') }}</h1>
        <p class="page-subtitle">
          {{ t('common.ok') }}: <span class="total-count">{{ pagination.total }}</span> {{ t('post.table.title') }}
        </p>
      </div>
      <a-button type="primary" size="large" @click="handleAdd" class="create-btn">
        <template #icon><PlusOutlined /></template>
        {{ t('post.action.new') }}
      </a-button>
    </div>

    <!-- Search & Filter Section -->
    <a-card :bordered="false" class="search-card">
      <a-form layout="vertical" class="search-form">
        <a-row :gutter="[24, 0]">
          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-form-item :label="t('post.title')" class="search-item">
              <a-input
                v-model:value="queryParam.title"
                :placeholder="t('post.title')"
                size="large"
                @keyup.enter="handleSearch"
                allow-clear
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="8" :lg="6">
            <a-form-item :label="t('post.status')" class="search-item">
              <a-select
                v-model:value="queryParam.status"
                :placeholder="t('post.status')"
                size="large"
                allow-clear
              >
                <a-select-option value="all">{{ t('common.ok') }}</a-select-option>
                <a-select-option value="draft">{{ t('post.status.draft') }}</a-select-option>
                <a-select-option value="published">{{ t('post.status.published') }}</a-select-option>
                <a-select-option value="archived">{{ t('post.status.archived') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="8" :lg="6" v-if="advanced">
            <a-form-item :label="t('post.createdAt')" class="search-item">
              <a-range-picker
                v-model:value="queryParam.dateRange"
                style="width: 100%"
                size="large"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="24" :lg="advanced ? 24 : 6" class="search-actions">
            <a-space size="middle" :wrap="true">
              <a-button type="primary" size="large" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                {{ t('post.action.search') }}
              </a-button>
              <a-button size="large" @click="handleReset">
                <template #icon><ClearOutlined /></template>
                {{ t('post.action.reset') }}
              </a-button>
              <a-divider type="vertical" />
              <a class="advanced-toggle" @click="advanced = !advanced">
                {{ advanced ? '收起筛选' : '展开筛选' }}
                <CaretDownOutlined :style="{ transform: advanced ? 'rotate(180deg)' : '', transition: 'all 0.3s' }" />
              </a>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- Bulk Actions -->
    <a-alert
      v-if="selectedRowKeys.length > 0"
      type="info"
      show-icon
      class="bulk-actions-bar"
      :closable="true"
    >
      <template #message>
        <span class="selection-info">
          已选中 <strong style="color: #1890ff">{{ selectedRowKeys.length }}</strong> 项
        </span>
        <a-divider type="vertical" style="margin: 0 12px" />
        <a-button danger size="small" @click="handleBulkDelete">
          <template #icon><DeleteOutlined /></template>
          {{ t('post.action.bulkDelete') }}
        </a-button>
      </template>
    </a-alert>

    <!-- Data Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
        class="post-table"
        size="middle"
      >
        <template #headerCell="{ column }">
          <div class="table-header-cell">{{ column.title }}</div>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="title-cell">
              <div class="title-text">{{ record.title }}</div>
              <div class="title-slug">{{ record.slug }}</div>
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-badge
              :status="POST_STATUS_CONFIG[record.status as keyof typeof POST_STATUS_CONFIG].status"
              :text="t(POST_STATUS_CONFIG[record.status as keyof typeof POST_STATUS_CONFIG].label)"
              class="status-badge"
            />
          </template>

          <template v-if="column.key === 'createdAt'">
            <div class="date-cell">
              <CalendarOutlined class="date-icon" />
              {{ formatDate(record.createdAt) }}
            </div>
          </template>

          <template v-if="column.key === 'updatedAt'">
            <div class="date-cell">
              <ClockCircleOutlined class="date-icon" />
              {{ formatDate(record.updatedAt) }}
            </div>
          </template>

          <template v-if="column.key === 'publishedAt'">
            <div v-if="record.publishedAt" class="date-cell published">
              <CheckCircleOutlined class="date-icon" />
              {{ formatDate(record.publishedAt) }}
            </div>
            <div v-else class="date-cell unpublished">
              <span>未发布</span>
            </div>
          </template>

          <template v-if="column.key === 'action'">
            <a-space class="action-buttons">
              <a-button
                type="text"
                size="small"
                @click="handleDetail(record)"
                class="action-btn detail-btn"
                title="查看详情"
              >
                <template #icon><EyeOutlined /></template>
              </a-button>
              <a-button
                type="text"
                size="small"
                @click="handleEdit(record)"
                class="action-btn edit-btn"
                title="编辑"
              >
                <template #icon><EditOutlined /></template>
              </a-button>
              <a-popconfirm
                :title="t('post.message.deleteConfirm')"
                ok-text="OK"
                cancel-text="Cancel"
                @confirm="handleDelete(record)"
              >
                <a-button type="text" size="small" danger class="action-btn delete-btn" title="删除">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
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
  showTotal: (total: number) => `${total} items`,
  pageSizeOptions: ['10', '20', '50'],
  showSizeChanger: true,
  showQuickJumper: true
})

// Columns configuration
const columns = [
  {
    title: t('post.table.title'),
    dataIndex: 'title',
    key: 'title',
    width: 220,
    ellipsis: true
  },
  {
    title: t('post.table.status'),
    key: 'status',
    width: 110,
    align: 'center'
  },
  {
    title: t('post.table.createdAt'),
    key: 'createdAt',
    width: 160,
    align: 'center'
  },
  {
    title: t('post.table.updatedAt'),
    key: 'updatedAt',
    width: 160,
    align: 'center'
  },
  {
    title: t('post.table.publishedAt'),
    key: 'publishedAt',
    width: 160,
    align: 'center'
  },
  {
    title: t('post.table.action'),
    key: 'action',
    width: 140,
    fixed: 'right',
    align: 'center'
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
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 项吗？删除后将无法恢复。`,
    okText: 'OK',
    cancelText: 'Cancel',
    okButtonProps: { danger: true },
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
.post-list-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #8c8c8c;
}

.total-count {
  color: #1890ff;
  font-weight: 600;
  font-size: 16px;
}

.create-btn {
  min-width: 120px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
}

/* Search Card */
.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

:deep(.search-card .ant-card-body) {
  padding: 20px;
}

.search-form {
  margin: 0;
}

.search-item {
  margin-bottom: 0;
}

:deep(.search-item .ant-form-item-label) {
  padding-bottom: 8px;
}

:deep(.search-item .ant-form-item-label > label) {
  font-weight: 500;
  color: #262626;
}

.search-actions {
  display: flex;
  align-items: flex-end;
}

.advanced-toggle {
  cursor: pointer;
  color: #1890ff;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.advanced-toggle:hover {
  color: #40a9ff;
}

/* Bulk Actions Bar */
.bulk-actions-bar {
  margin-bottom: 16px;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

:deep(.bulk-actions-bar .ant-alert-message) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-info {
  font-size: 14px;
  color: #262626;
}

/* Table Card */
.table-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

:deep(.table-card .ant-card-body) {
  padding: 0;
}

/* Table Styles */
.post-table {
  font-size: 14px;
}

:deep(.post-table .ant-table) {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.post-table .ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.post-table .ant-table-body > tr:hover > td) {
  background: #f5f7fa;
}

:deep(.post-table .ant-table-body > tr > td) {
  border-bottom: 1px solid #f0f0f0;
}

.table-header-cell {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #262626;
}

/* Title Cell */
.title-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-weight: 500;
  color: #262626;
  word-break: break-word;
}

.title-slug {
  font-size: 12px;
  color: #8c8c8c;
}

/* Status Badge */
.status-badge {
  font-weight: 500;
}

:deep(.status-badge .ant-badge-status-dot) {
  width: 8px;
  height: 8px;
}

/* Date Cell */
.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #595959;
}

.date-icon {
  font-size: 12px;
  color: #8c8c8c;
}

.date-cell.published {
  color: #52c41a;
}

.date-cell.unpublished {
  color: #bfbfbf;
  font-style: italic;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 4px 8px;
  height: 28px;
  border-radius: 4px;
  transition: all 0.3s;
  color: #1890ff;
}

.action-btn:hover {
  background: #e6f7ff;
  color: #0050b3;
}

.action-btn.detail-btn {
  color: #1890ff;
}

.action-btn.edit-btn {
  color: #faad14;
}

.action-btn.edit-btn:hover {
  background: #fff7e6;
  color: #ad6800;
}

.action-btn.delete-btn {
  color: #ff4d4f;
}

.action-btn.delete-btn:hover {
  background: #ffebe9;
  color: #a6000f;
}

/* Responsive */
@media (max-width: 768px) {
  .post-list-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .create-btn {
    width: 100%;
  }

  .search-actions {
    width: 100%;
  }

  :deep(.search-actions .ant-space-item) {
    flex: 1 1 auto;
  }

  :deep(.ant-table-wrapper .ant-table-body) {
    font-size: 13px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

/* Pagination */
:deep(.ant-pagination) {
  margin-top: 16px;
  text-align: right;
}

:deep(.ant-pagination .ant-pagination-item-active) {
  border-color: #1890ff;
}

:deep(.ant-pagination .ant-pagination-item-active a) {
  color: #1890ff;
}
</style>
