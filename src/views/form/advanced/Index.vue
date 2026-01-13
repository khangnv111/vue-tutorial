<template>
  <a-card class="card" title="仓库管理" :bordered="false">
    <repository-form ref="repository" :show-submit="false" />
  </a-card>
  <a-card class="card" title="任务管理" :bordered="false">
    <task-form ref="task" :show-submit="false" />
  </a-card>

  <!-- table -->
  <a-card>
    <a-table :columns="columns" :data-source="data" :pagination="false" :loading="memberLoading">
      <template v-slot:name="{ text, record }">
        <a-input
            v-if="record.editable"
            :value="text"
            :placeholder="'成员姓名'"
            style="margin: -5px 0"
            @change="e => handleChange(e.target.value, record.key, 'name')"
        />
        <span v-else>{{ text }}</span>
      </template>

      <template v-slot:workId="{ text, record }">
        <a-input
            v-if="record.editable"
            :value="text"
            :placeholder="'工号'"
            style="margin: -5px 0"
            @change="e => handleChange(e.target.value, record.key, 'workId')"
        />
        <span v-else>{{ text }}</span>
      </template>

      <template v-slot:department="{ text, record }">
        <a-input
            v-if="record.editable"
            :value="text"
            :placeholder="'所属部门'"
            style="margin: -5px 0"
            @change="e => handleChange(e.target.value, record.key, 'department')"
        />
        <span v-else>{{ text }}</span>
      </template>

      <template v-slot:operation="{ record }">
        <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="() => remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="() => cancel(record.key)">取消</a>
            </span>
        </template>
        <span v-else>
            <a @click="() => toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="() => remove(record.key)">
              删除
            </a-popconfirm>
          </span>
      </template>
    </a-table>
    <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">
      新增成员
    </a-button>
  </a-card>

  <!-- fixed footer toolbar -->
<!--  <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">-->
<!--      <span class="popover-wrapper">-->
<!--        <a-popover-->
<!--            title="表单校验信息"-->
<!--            overlay-class-name="antd-pro-pages-forms-style-errorPopover"-->
<!--            trigger="click"-->
<!--            :get-popup-container="trigger => trigger.parentNode"-->
<!--        >-->
<!--          <template #content>-->
<!--            <li-->
<!--                v-for="item in errors"-->
<!--                :key="item.key"-->
<!--                @click="() => scrollToField(item.key)"-->
<!--                class="antd-pro-pages-forms-style-errorListItem"-->
<!--            >-->
<!--              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />-->
<!--              <div>{{ item.message }}</div>-->
<!--              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>-->
<!--            </li>-->
<!--          </template>-->
<!--          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">-->
<!--            <a-icon type="exclamation-circle" />{{ errors.length }}-->
<!--          </span>-->
<!--        </a-popover>-->
<!--      </span>-->
<!--    <a-button type="primary" @click="validate" :loading="loading">提交</a-button>-->
<!--  </footer-tool-bar>-->
</template>

<script setup>
import { reactive, ref } from "vue";
import RepositoryForm from './RepositoryForm.vue'
import TaskForm from './TaskForm.vue'
// import FooterToolBar from '@/components/FooterToolbar'
// import { baseMixin } from '@/store/app-mixin'

const repository = ref(null)
const task = ref(null)

// const loading = ref(false)
const memberLoading = ref(false)
const data = reactive([
  { key: '1', name: '小明', workId: '001', editable: false, department: '行政部' },
  { key: '2', name: '李莉', workId: '002', editable: false, department: 'IT部' },
  { key: '3', name: '王小帅', workId: '003', editable: false, department: '财务部' }
])

const columns = [
  { title: '成员姓名', dataIndex: 'name', key: 'name' },
  { title: '工号', dataIndex: 'workId', key: 'workId' },
  { title: '所属部门', dataIndex: 'department', key: 'department' },
  { title: '操作', key: 'action' }
]

// const errors = ref([])

// const fieldLabels = {
//   name: '仓库名',
//   workId: '工号',
//   department: '所属部门'
// }

function newMember() {
  const length = data.length
  data.push({
    key: length === 0 ? '1' : (parseInt(data[length - 1].key) + 1).toString(),
    name: '',
    workId: '',
    department: '',
    editable: true,
    isNew: true
  })
}

function remove(key) {
  const index = data.findIndex(item => item.key === key)
  if (index !== -1) data.splice(index, 1)
}

function toggle(key) {
  const target = data.find(item => item.key === key)
  target._originalData = { ...target }
  target.editable = !target.editable
}

function cancel(key) {
  const target = data.find(item => item.key === key)
  Object.assign(target, target._originalData)
  delete target._originalData
}

function handleChange(value, key, column) {
  const target = data.find(item => item.key === key)
  if (target) target[column] = value
}

function saveRow(record) {
  memberLoading.value = true
  const { key, name, workId, department } = record
  if (!name || !workId || !department) {
    memberLoading.value = false
    window.$message?.error('请填写完整成员信息。')
    return
  }
  setTimeout(() => {
    const target = data.find(item => item.key === key)
    target.editable = false
    target.isNew = false
    memberLoading.value = false
  }, 800)
}

// function scrollToField(fieldKey) {
//   const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
//   if (labelNode) labelNode.scrollIntoView(true)
// }

// function validate() {
//   errors.value = []
//   const repositoryForm = new Promise((resolve, reject) => {
//     repository.value.form.validateFields((err, values) => {
//       if (err) reject(err)
//       else resolve(values)
//     })
//   })
//
//   const taskForm = new Promise((resolve, reject) => {
//     task.value.form.validateFields((err, values) => {
//       if (err) reject(err)
//       else resolve(values)
//     })
//   })
//
//   Promise.all([repositoryForm, taskForm])
//       .then(values => {
//         window.$notification?.error({
//           message: 'Received values of form:',
//           description: JSON.stringify(values)
//         })
//       })
//       .catch(() => {
//         const tmp = { ...repository.value.form.getFieldsError(), ...task.value.form.getFieldsError() }
//         errors.value = Object.keys(tmp)
//             .filter(key => tmp[key])
//             .map(key => ({ key, message: tmp[key][0], fieldLabel: fieldLabels[key] }))
//       })
// }
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
/* giữ nguyên style của bạn */
</style>
