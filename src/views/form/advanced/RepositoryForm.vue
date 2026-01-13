<template>
  <a-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      class="form"
      @submit.prevent="handleSubmit"
  >
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="仓库名" name="name">
          <a-input
              v-model:value="formData.name"
              placeholder="请输入仓库名称"
          />
        </a-form-item>
      </a-col>

      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="仓库域名" name="url">
          <a-input
              v-model:value="formData.url"
              addonBefore="http://"
              addonAfter=".com"
              placeholder="请输入"
          />
        </a-form-item>
      </a-col>

      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="仓库管理员" name="owner">
          <a-select v-model:value="formData.owner" placeholder="请选择管理员">
            <a-select-option value="王同学">王同学</a-select-option>
            <a-select-option value="李同学">李同学</a-select-option>
            <a-select-option value="黄同学">黄同学</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="审批人" name="approver">
          <a-select v-model:value="formData.approver" placeholder="请选择审批员">
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item label="生效日期" name="dateRange">
          <a-range-picker v-model:value="formData.dateRange" style="width: 100%" />
        </a-form-item>
      </a-col>

      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item label="仓库类型" name="type">
          <a-select v-model:value="formData.type" placeholder="请选择仓库类型">
            <a-select-option value="公开">公开</a-select-option>
            <a-select-option value="私密">私密</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item v-if="showSubmit">
      <a-button type="primary" htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineProps({
  showSubmit: { type: Boolean, default: false }
})

const formRef = ref(null)

const formData = reactive({
  name: '',
  url: '',
  owner: '',
  approver: '',
  dateRange: [],
  type: ''
})

// rules validation
const rules = {
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入仓库域名', trigger: 'blur' },
    { validator: (rule, value) => {
        if (!/^user-(.*)$/.test(value)) return Promise.reject(new Error('需要以 user- 开头'))
        return Promise.resolve()
      }, trigger: 'blur' }
  ],
  owner: [{ required: true, message: '请选择管理员', trigger: 'change' }],
  approver: [{ required: true, message: '请选择审批员', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  type: [{ required: true, message: '请选择仓库类型', trigger: 'change' }]
}

function handleSubmit() {
  formRef.value.validate().then(() => {
    window.$notification?.error({
      message: 'Received values of form:',
      description: JSON.stringify(formData)
    })
  }).catch(err => {
    console.log('validate failed', err)
  })
}
</script>

<style scoped>
.form-row {
  margin-bottom: 16px;
}
</style>
