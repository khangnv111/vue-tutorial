<template>
  <a-card :bordered="false">

    <!-- Search -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model:value="queryParam.id" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select v-model:value="queryParam.status" placeholder="请选择">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number v-model:value="queryParam.callNo" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model:value="queryParam.date" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="advanced ? 24 : 8" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced ? { float: 'right' } : {}">
                <a-button type="primary" @click="fetchData">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
                <a style="margin-left: 8px" @click="advanced = !advanced">
                  {{ advanced ? '收起' : '展开' }}
                </a>
              </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- Operator -->
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd">新建</a-button>
    </div>

    <!-- Table -->
    <a-table
        rowKey="key"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'serial'">
          {{ index + 1 }}
        </template>

        <template v-if="column.key === 'status'">
          <a-badge
              :status="statusMap[record.status].status"
              :text="statusMap[record.status].text"
          />
        </template>

        <template v-if="column.key === 'action'">
          <a @click="handleEdit(record)">配置</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">订阅报警</a>
        </template>
      </template>
    </a-table>

    <!-- Modals -->
<!--    <CreateForm-->
<!--        v-model:visible="visible"-->
<!--        :loading="confirmLoading"-->
<!--        :model="mdl"-->
<!--        @ok="handleOk"-->
<!--    />-->
  </a-card>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
// import { getRoleList, getServiceList } from '@/api/manage'
// import CreateForm from './modules/CreateForm'

const advanced = ref(false)
const visible = ref(false)
const confirmLoading = ref(false)
const mdl = ref<any>(null)

const queryParam = reactive<any>({
  id: '',
  status: '0'
})

const loading = ref(false)
const dataSource = ref<any[]>([])
const selectedRowKeys = ref<any[]>([])
const selectedRows = ref<any[]>([])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`
})

const statusMap: any = {
  0: { status: 'default', text: '关闭' },
  1: { status: 'processing', text: '运行中' },
  2: { status: 'success', text: '已上线' },
  3: { status: 'error', text: '异常' }
}

const columns = [
  { title: '#', key: 'serial' },
  { title: '规则编号', dataIndex: 'no' },
  { title: '描述', dataIndex: 'description' },
  { title: '服务调用次数', dataIndex: 'callNo' },
  { title: '状态', key: 'status' },
  { title: '更新时间', dataIndex: 'updatedAt' },
  { title: '操作', key: 'action', width: 150 }
]

const fetchData = async () => {
  loading.value = true
  // const res = await getServiceList({
  //   ...queryParam,
  //   pageNo: pagination.current,
  //   pageSize: pagination.pageSize
  // })
  //
  // dataSource.value = res.result.data
  // pagination.total = res.result.total
  loading.value = false
}

const handleTableChange = (pager: any) => {
  pagination.current = pager.current
  fetchData()
}

const resetSearch = () => {
  Object.keys(queryParam).forEach(k => delete queryParam[k])
  fetchData()
}

const rowSelection = {
  selectedRowKeys,
  onChange: (keys: any[], rows: any[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }
}

const handleAdd = () => {
  mdl.value = null
  visible.value = true
}

const handleEdit = (record: any) => {
  mdl.value = { ...record }
  visible.value = true
}

const handleOk = async () => {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    visible.value = false
    message.success(mdl.value ? '修改成功' : '新增成功')
    fetchData()
  }, 1000)
}

const handleSub = (record: any) => {
  record.status !== 0
      ? message.success(`${record.no} 订阅成功`)
      : message.error(`${record.no} 订阅失败，规则已关闭`)
}

onMounted(() => {
  // getRoleList({ t: Date.now() })
  fetchData()
})
</script>
